import ApiCall from "../apicalls/ApiCall";
import Endpoint from "../Endpoint";
import {SETTING_CATEGORY, SETTING_USER_PERM} from "../../settings";
import AuthApiCall from "../apicalls/AuthApiCall";

export default new Endpoint("/settings")
    .addCallback(new ApiCall(
            "GET",
            "/permissions",
            async () => {
                return SETTING_USER_PERM
            },
            {}
        )
    ).addCallback(new ApiCall(
            "GET",
            "/categories",
            async () => {
                return SETTING_CATEGORY
            },
            {}
        )
    ).addCallback(new AuthApiCall(
            SETTING_USER_PERM,
            "GET",
            "/dashboard",
            async (req, res, user) => {

            },
            {}
        )
    )