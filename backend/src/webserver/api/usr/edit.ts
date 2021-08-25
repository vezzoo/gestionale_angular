import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import ECODE from "../../ECODE";
import User from "../../../database/models/User.model";

export default new AuthApiCall(
    null, //allow anyone (in order to self edit password)
    "PATCH",
    "/",
    async (req, res, user, body) => {
        if (!body.id)
            body.id = user._id?.toString()

        if ((body.id !== user._id?.toString() || !!body.permissions) && ! user.has_permission("user_management"))
            //se si sta cercando di modificare un altro utente oppure i permessi di un utente
            //bisogna essere root oppure avere il permesso "user_management"
            return ECODE.E_PERM

        const target_user = (body.id !== user._id?.toString()) ? await User.findById(body.id) as User: user
        if(!target_user)
            return ECODE.E_NO_USER

        if(body.password){
            console.info(`Password change for user ${target_user.username} by ${user.username}`)
            target_user.password = body.password
        }

        if(body.permissions){
            console.info(`permission change for user ${target_user.username} by ${user.username} from ${target_user.permissions} to ${body.permissions}`)
            target_user.permissions = body.permissions
        }

        await target_user.save()
        return {status: true}
    },
    {
        body: S.object()
            .prop("id", S.string())
            .prop("password", S.string())
            .prop("permissions", S.array().items(S.string()))
    }
)