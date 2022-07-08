import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import ProductModel from "../../../database/models/Product.model";

export default new AuthApiCall(
    ["storage_read", "cash_desk"],
    "GET",
    "/:category", //List all categoruies concatenated by '&' and specify all for all categories
    async (req, res, user, _, __, params) => {
        const products = await getProductList(params)
        const data: any = {}

        products.forEach((e: any) => {
            if(!data[e.category]) data[e.category] = []
            data[e.category].push(e.getObject(["category"], {"_id": "id"}))
        })

        return {
            categories: Object.keys(data).map(e => ({
                title: e,
                children: data[e].sort((a: any, b: any) => a.position - b.position)
            }))
        }
    },
    {
        params: S.object()
            .prop("category", S.string())
    }
)

export async function getProductList(params: any) {
    if(!params.category)
        params.category = "all"
    return await ProductModel.find(params.category === "all" ? {} : {category: {"$in": params.category.split("&")}})
}