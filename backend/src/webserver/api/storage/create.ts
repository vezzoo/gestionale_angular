import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import Product from "../../../database/models/Product.model";
import ECODE from "../../ECODE";

export default new AuthApiCall(
    "storage_write",
    "PUT",
    "/",
    async (req, res, user, body) => {

        const product = new Product(body.title, body.price, body.category, body.stock, body.description || "")
        try{
            await product.save()
        } catch (e) {
            // @ts-ignore
            if (e.constructor.name === "MongoError" && e.code === 11000)
                return ECODE.E_DUP
            return ECODE.E_UNCOMMON(500, "Database error", e)
        }
        return {status: true}
    },
    {
        body: S.object()
            .prop("title", S.string()).required()
            .prop("category", S.string()).required()
            .prop("price", S.integer().minimum(1)).required()
            .prop("stock", S.integer().minimum(0)).default(0)
            .prop("description", S.string()).default("")
    }
)