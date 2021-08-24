import ApiCall from "../apicalls/ApiCall";
import Endpoint from "../Endpoint";

export default new Endpoint("/permissions").addCallback(new ApiCall(
    "GET",
    "/",
    async () => {
        return [
            "user_management",
            "storage_write",
            "storage_read",
            "cash_desk"
        ]
    },
    {}
))