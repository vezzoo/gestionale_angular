import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import ProductModel, {IProductDocument, IProductModel} from "../../../database/models/Product.model";

export default new AuthApiCall(
    ["storage_read", "cash_desk"],
    "GET",
    "/:category", //List all categoruies concatenated by '&' and specify all for all categories
    async (req, res, user, _, __, params) => {
        const products = await ProductModel.find(params === "all" ? {} : {category: {"$in": params.split("&")}}).exec()
        const data: any = {}

        products.forEach((e: any) => {
            if(!data[e.category]) data[e.category] = []
            data[e.category] = {
                id: e._id.toString(),
                title: e.title,
                price: e.price,
                left: e.stock,
                description: e.description,
            }
        })

        return {
            categories: Object.keys(data).map(e => ({
                title: e,
                children: data[e]
            }))
        }
    },
    {
        params: S.object()
            .prop("category", S.string())
    }
)