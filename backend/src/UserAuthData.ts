import {IUser, IUserDocument} from "./database/models/User.model"

export default class UserAuthData{
    private permissions: string[]
    private id: string

    constructor(user: IUserDocument) {
        this.permissions = user.permissions;
        this.id = user._id.toString();
    }

    public toJsonValue(){
        return {
            id: this.id,
            permissions: this.permissions
        }
    }
}