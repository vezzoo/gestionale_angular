import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema"
import Product from "../../../database/models/Product.model";

export default new AuthApiCall(
    "storage_write",
    "DELETE",
    "/:productid",
    async (req, res, user, body, headers, parameters)=>{
        await Product.delete(parameters.productid)
        return {status: true}
    },
    {
        params: S.object()
            .prop("productid", S.string()).required()
    }
)