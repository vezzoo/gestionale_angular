import Database from "./database/database";
import UserModel, {IUserDocument} from "./database/models/User.model";
import jwt from 'jsonwebtoken'
import {SETTING_JWT_PUBLIC} from "./settings";


(async function (){
    await Database.connect();


    await Database.disconnect()
})()