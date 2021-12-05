import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import User from "../../../database/models/User.model";

export default new AuthApiCall(
    null, //allow anyone (in order to self edit password)
    "GET",
    "/:userid",
    async (req, res, user, _, __, parameters) => {
        let user_list = undefined
        if(user.has_permission("user_management"))
            user_list = (await User.find(!!parameters.userid ? {_id: parameters.userid} : {}) as User[]).map(e => ({id: e._id?.toString() || "nope", username: e.username, permissions: e.permissions, isLefthanded: e.is_lefthanded})) //all users

        return {
            me: {id: user._id?.toString(), username: user.username, permissions: user.permissions},
            user_list: !!parameters.userid ? undefined : user_list,
            user: !!parameters.userid && user_list && user_list.length > 0 ? user_list[0] : undefined
        }
    },
    {
        params: S.object().prop("userid", S.string())
    }
)