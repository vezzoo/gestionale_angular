import ApiCall from "../apicalls/ApiCall";
import Endpoint from "../Endpoint";
import {SETTING_CATEGORY} from "../../settings";

export default new Endpoint("/settings")
    .addCallback(new ApiCall(
            "GET",
            "/permissions",
            async () => {
                return [
                    "user_management",
                    "storage_write",
                    "storage_read",
                    "cash_desk"
                ]
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
    )