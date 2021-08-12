import {model, Model, Schema, ObjectId} from "mongoose";
import * as crypto from "crypto";
import jwt from 'jsonwebtoken'
import UserAuthData from "../../UserAuthData";
import {SETTING_JWT_PRIVATE, SETTING_TOKEN_EXPIRE_HOURS} from "../../settings";


export interface IUser {
    _id: ObjectId;
    username: string;
    password: string;
    password_salt: string;
    permissions: string[];
}

const UserSchema = new Schema({
    username: String,
    password: String,
    password_salt: String,
    permissions: Array<String>()
})

UserSchema.pre('save', function(next){
    if (this.isNew || this.isModified("password")) {
        if(this.get('password') === "-"){
            this.set("password_salt", "LQ==")
            this.set("password", "LQ==")
        } else {
            const salt = Math.random().toString(26).substr(2);
            const psw = Buffer.from(this.get('password'), 'utf-8');
            this.set('password', crypto.createHmac("sha384", psw).update(salt).digest('base64'));
            this.set('password_salt', salt)
        }
    }
    return next();
})

UserSchema.methods.authenticate = function (psw: string): string | null {
    const hmac = crypto.createHmac("sha384", psw).update(this.get('password_salt')).digest('base64')
    if (hmac !== this.get('password')) {
        console.warn("Login failed for user", this.get('username'))
        return null;
    }
    return jwt.sign(new UserAuthData(this as unknown as IUserDocument).toJsonValue(), SETTING_JWT_PRIVATE, {algorithm: 'ES256', expiresIn: SETTING_TOKEN_EXPIRE_HOURS})
};

export interface IUserDocument extends IUser, Document {
    authenticate: (this: IUserDocument, psw: string) => string | null
}

export interface IUserModel extends Model<IUserDocument> {
}

export default model<IUserDocument>("user", UserSchema)
