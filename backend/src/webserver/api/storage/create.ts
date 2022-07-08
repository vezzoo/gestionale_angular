import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import Product from "../../../database/models/Product.model";
import ECODE from "../../ECODE";
import { getProductList} from "./list";
import { updateItem } from "./edit";

export default new AuthApiCall(
    "storage_write",
    "PUT",
    "/",
    async (req, res, user, body) => {
        const products = await getProducts(body.category)
        const position = /* body.position || */ (getLastPosition(products) + 1)
        const product = new Product(body.title, body.price, body.category, position, body.stock, body.description || "")

        // Non funge
        // if (body.position != null) {
        //     await (async function sliceProduct(position: number) {
        //         const productAtPosition: any = products
        //             .filter((p: any) => p.category === body.category)
        //             .find((p: any) => p.position === position && p.title !== body.title)

        //         if (productAtPosition) {
        //             sliceProduct(productAtPosition.position + 1)
        //             await updateItem({ id: productAtPosition.id, position: productAtPosition.position + 1 }) // ci sarebbero da catchare gli errori ...
        //         }
        //     })(product.position);
        // }

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

async function getProducts(category: string) {
    const productList = await getProductList({})

    return productList.filter((e: any) => e.category === category)
}

function getLastPosition(products: Array<any>): number {
    const positions = products.map((p: any) => p.position);
    const max = Math.max(...positions);

    return max >= 0 ? max : -1;
}