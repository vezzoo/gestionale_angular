import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import ProductModel from "../../../database/models/Product.model";
import ECODE from "../../ECODE";

export default new AuthApiCall(
    "storage_write",
    "PUT",
    "/",
    async (req, res, user, body) => {
        // title: string;
        // price: number;
        // left: number;
        // description: string | undefined;
        const product = new ProductModel({ //todo maybe sanitize those things
            title: body.title,
            price: body.price, //price is in cents !!
            stock: body.stock,
            category: body.category,
            description: body.description || ""
        })
        try{
            await product.save()
        } catch (e) {
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
            .prop("price", S.integer()).required()
            .prop("stock", S.integer()).default(0)
            .prop("description", S.string()).default("")
    }
)