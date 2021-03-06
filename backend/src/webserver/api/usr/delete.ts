import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema"
import UserModel from "../../../database/models/User.model";
import ECODE from "../../ECODE";

export default new AuthApiCall(
    "user_management",
    "DELETE",
    "/:userid",
    async (req, res, user, body, headers, parameters)=>{
        await UserModel.delete(parameters.userid)
        return {status: true}
    },
    {
        params: S.object()
            .prop("userid", S.string()).required()
    }
)