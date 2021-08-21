import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema"
import UserModel from "../../../database/models/User.model";
import ECODE from "../../ECODE";

/**
 * Crea un utente con username dato.
 *
 * ritorna l'id utente creato e la password generata randomicamente
 */
export default new AuthApiCall(
    "user_management",
    "PUT",
    "/",
    async (req, res, user, body)=>{
        const psw = Math.random().toString(26).substr(2);
        const new_user = new UserModel(body.username, psw, body.permissions)
        try {
            await new_user.save()
        } catch (e) {
            if (e.constructor.name === "MongoError" && e.code === 11000)
                return ECODE.E_DUP
            return ECODE.E_UNCOMMON(500, "Database error", e)
        }

        return {
            id: new_user._id?.toString(),
            password: psw
        }
    },
    {
        body: S.object()
            .prop("username", S.string()).required()
            .prop("permissions", S.array().items(S.string().enum(["user_management", "storage_write", "storage_read", "cash_desk", "todo"]))) //todo
    }
)