import AbstractCall from "./AbstractApiCall";
import {FastifyReply, FastifyRequest, FastifySchema, HTTPMethods} from "fastify";
import {IUserDocument} from "../../database/models/User.model";
import Endpoint from "../Endpoint";
import {SETTING_AUTHENTICATION_HEADER, SETTING_JWT_PUBLIC} from "../../settings";
import UserAuthData from "../../UserAuthData";
import jwt from "jsonwebtoken"
import UserModel from "../../database/models/User.model";
import ECODE from "../ECODE";

export default class AuthApiCall extends AbstractCall {

    constructor(
        permission: string,
        method: HTTPMethods,
        url: string,
        handler: (req: FastifyRequest, res: FastifyReply, user: IUserDocument, body: any, headers: any, parameters: any) => any,
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

    public static async tokenValidation(permission: string, req: FastifyRequest): Promise<IUserDocument>{
        const token: string | undefined | string[] = req.headers[SETTING_AUTHENTICATION_HEADER.toLowerCase()]

        if(!token)
            throw Error("E_MALFORMED_REQ")

        if(Array.isArray(token))
            throw Error("E_MALFORMED_REQ")

        const user_data: UserAuthData = UserAuthData.fromToken(jwt.verify(token, SETTING_JWT_PUBLIC) as any); //BAD
        if (!user_data) throw Error("E_JWT_INVALID");
        if (!user_data.permissions.includes(permission) && !user_data.permissions.includes("root")) throw Error("E_PERM");

        const user = await UserModel.findById(user_data.id).exec()
        if(!user)
            throw Error("E_NO_USER")

        return user
    }

}