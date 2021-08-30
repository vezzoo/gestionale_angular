import {ObjectId} from "mongoose";
import * as crypto from "crypto";
import jwt from 'jsonwebtoken'
import UserAuthData from "../../UserAuthData";
import {SETTING_JWT_PRIVATE, SETTING_TOKEN_EXPIRE_HOURS} from "../../settings";
import {UserPermission} from "../../@types/permissions";
import AuthApiCall from "../../webserver/apicalls/AuthApiCall";
import DBDocument from "../wrapper/DBDocument";
import Field, {FieldArray} from "../wrapper/decorators/Field";
import Unique from "../wrapper/decorators/Unique";
import Required from "../wrapper/decorators/Required";
import Collection from "../wrapper/decorators/Collection";

@Collection
export default class User extends DBDocument{
    public _id?: ObjectId
    public __v?: number

    @Field
    @Unique
    @Required
    public username: string;

    @Field
    @Required
    private _password?: string;

    @Field
    private password_salt: string;

    @FieldArray(String)
    @Required
    public permissions: string[]

    set password(value: string) {
        const psw = Buffer.from(value || "insecure", 'utf-8');
        this._password = crypto.createHmac("sha384", psw).update(this.password_salt).digest('base64');
    }

    public authenticate(password: string): string | null{
        const hmac = crypto.createHmac("sha384", password).update(this.password_salt).digest('base64')
        if (hmac !== this._password) {
            console.warn("Login failed for usr", this.get('username'))
            return null;
        }
        return jwt.sign(UserAuthData.fromUserDocument(this).toJsonValue(), SETTING_JWT_PRIVATE, {
            algorithm: 'ES256',
            expiresIn: SETTING_TOKEN_EXPIRE_HOURS
        })
    }

    public has_permission(perms: UserPermission | UserPermission[] | null, ored = true): boolean {
        return AuthApiCall.has_permission(this, perms, ored)
    }

    constructor(username: string, password: string, permissions: string[], password_salt?: string) {
        super();
        this.username = username
        if(password_salt)
            this.password_salt = password_salt
        else
            this.password_salt = Math.random().toString(26).substr(2)
        this.password = password
        this.permissions = permissions
    }
}