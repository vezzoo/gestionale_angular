import ApiCall from "../apicalls/ApiCall";
import Endpoint from "../Endpoint";
import {SETTING_CATEGORY, SETTING_DASHBOARD_FUNCTIONS, SETTING_PRINTERS, SETTING_USER_PERM} from "../../settings";
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
                return {
                    categories: SETTING_DASHBOARD_FUNCTIONS.map(e => ({
                        title: e.title,
                        children: e.children.filter(func => user.has_permission(func.permissions, false))
                    })).filter(e => e.children.length > 0)
                };
            },
            {}
        )
    ).addCallback(new ApiCall(
            "GET",
            "/printers",
            async () => {
                return {
                    printers: [...new Set(SETTING_PRINTERS.map(p => new URL(p.name).origin))]
                };
            },
            {}
        )
    )