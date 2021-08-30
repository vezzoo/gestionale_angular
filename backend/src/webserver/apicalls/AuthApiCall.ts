import AbstractCall from "./AbstractApiCall";
import {FastifyReply, FastifyRequest, FastifySchema, HTTPMethods} from "fastify";
import User from "../../database/models/User.model";
import Endpoint from "../Endpoint";
import {SETTING_AUTHENTICATION_HEADER, SETTING_JWT_PUBLIC} from "../../settings";
import UserAuthData from "../../UserAuthData";
import jwt from "jsonwebtoken"
import UserModel from "../../database/models/User.model";
import ECODE from "../ECODE";
import {UserPermission} from "../../@types/permissions";

export default class AuthApiCall extends AbstractCall {

    constructor(
        permission: UserPermission | UserPermission[] | null,
        method: HTTPMethods,
        url: string,
        handler: (req: FastifyRequest, res: FastifyReply, user: User, body: any, headers: any, parameters: any) => any,
        schema: FastifySchema,
        fallback?: (req: FastifyRequest, res: FastifyReply, err: Error) => any) {

        super({
            method,
            url,
            schema: schema,
            attachValidation: true,
            handler: Endpoint.secureCallback(
                async (req: FastifyRequest, res: FastifyReply) => AbstractCall.default_handler(req, res, async (req, res, body, headers, params) => {
                    try {
                        return await handler(req, res, await AuthApiCall.tokenValidation(permission, req), body, headers, params);
                        //update token
                    } catch (e) {
                        if(process.env.PRODUCTION !== "1") console.log(e.message, e.stack)
                        if (fallback) return await fallback(req, res, e);
                        return ECODE.get(e.message)
                    }
                })
            )
        });
    }

    public static async tokenValidation(permission: UserPermission | UserPermission[] | null, req: FastifyRequest): Promise<User>{
        const token: string | undefined | string[] = req.headers[SETTING_AUTHENTICATION_HEADER.toLowerCase()]

        if(!token)
            throw Error("E_MALFORMED_REQ")

        if(Array.isArray(token))
            throw Error("E_MALFORMED_REQ")

        let ver_data: any
        try{
            ver_data = jwt.verify(token, SETTING_JWT_PUBLIC) as any
        } catch (e){
            switch (e.message) {
                case "jwt expired":
                    throw Error("E_JWT_EXPIRED")
                case "jwt must be provided":
                    throw Error("E_NO_JWT")
                case "jwt malformed":
                    throw Error("E_MALFORMED_REQ")
                default:
                    throw Error(e.message)
            }
        }

        const user_data: UserAuthData = UserAuthData.fromToken(ver_data); //BAD
        if (!user_data) throw Error("E_JWT_INVALID");
        if (!this.has_permission(user_data, permission)) throw Error("E_PERM");

        const user = await UserModel.findById(user_data.id) as User
        if(!user)
            throw Error("E_NO_USER")

        return user
    }

    public static has_permission(user: User | UserAuthData, perms: UserPermission[] | UserPermission | null, ored=true): boolean{
        if (perms === null) return true
        if (!Array.isArray(perms)) perms = [perms]

        if(user.permissions.includes("root")) return true

        for(let p of perms){
            if(user.permissions.includes(p))
                if(ored) return true
            else
                if (!ored) return false
        }

        return !ored
    }

}