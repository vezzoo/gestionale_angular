import {IUserDocument} from "./database/models/User.model"

export default class UserAuthData{
    private _permissions: string[]
    private _id: string

    get id(): string {
        return this._id;
    }

    get permissions(): string[] {
        return this._permissions;
    }

    private constructor(user:  {id: string, permissions: string[]}) {
        this._permissions = user.permissions
        this._id = user.id
    }

    public toJsonValue(){
        return {
            id: this._id,
            permissions: this._permissions
        }
    }

    public static fromUserDocument(user: IUserDocument){
        return new UserAuthData({
            id: user._id.toString(),
            permissions: user.permissions || []
        })
    }

    public static fromToken(token: {id: string, permissions: string[]}): UserAuthData{
        return new UserAuthData(token)
    }
}