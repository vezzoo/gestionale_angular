import ApiCall from "../apicalls/ApiCall";
import Endpoint from "../Endpoint";

export default new Endpoint("/status")
    .addCallback(new ApiCall(
            "GET",
            "/",
            async () => {
                return { status: "UP" }
            },
            {}
        )
    )