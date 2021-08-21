import ApiCall from "../../../apicalls/ApiCall";
import S from "fluent-json-schema"
import User from "../../../../database/models/User.model";
import ECODE from "../../../ECODE";


export default new ApiCall(
    "POST",
    "/login",
    async (req, res, body) => {
        const user = await User.findOne({username: body.username}) as User
        if(!user)
            return ECODE.E_NO_USER

        const tok = user.authenticate(body.password);
        if(!tok)
            return ECODE.E_AUTH
        return {
            username: user.username,
            id: user._id?.toString(),
            token: tok,
            permissions: user.permissions //Aggiunta
        }
    },
    {
        body: S.object()
            .prop("username", S.string())
            .prop("password", S.string())
    }
)