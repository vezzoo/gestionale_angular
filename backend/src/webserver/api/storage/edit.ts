import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import ProductModel from "../../../database/models/Product.model";
import ECODE from "../../ECODE";
import { getProductList } from "./list";

export default new AuthApiCall(
    "storage_write",
    "PATCH",
    "/",
    async (req, res, user, body) => {
        const ret: any = {}
        let errored = false
        await Promise.all(body.editedItems.map(async (e: any) => { //dovrei scrivere dei tipi...
            if (!ret[e.id])
                ret[e.id] = {}

            if (e.position != null) {
                const products = await getProducts() as Array<any>
                const product = products.find((p: any) => p._id.toString() === e.id)
                
                if (e.position !== product.position) {
                    const add = e.position < product.position
                    const max = add ? product.position : e.position
                    const min = add ? e.position : product.position

                    const productsToUpdate = products
                        .filter(p => p.category === product.category)
                        .filter(p =>
                            (p.position > min && p.position < max) ||
                            (add ? p.position === min : p.position === max)
                        )

                    for (let i = 0; i < productsToUpdate.length; i++) {
                        const p = productsToUpdate[i]
                        const position = add ? p.position + 1 : p.position - 1
                        const id = p._id
                        const err = await updateItem({ id, position })

                        if (!err) {
                            ret[e.id][id] = {status: true}
                        } else {
                            ret[e.id][id] = {status: false, err}
                            errored = true
                        }
                    }
                }
            }

            let err = null
            if (Object.values(ret[e.id]).some((e: any) => !e.status))
                err = 'Some item update failed'

            if (!err)
                err = await updateItem(e)

            if (!err)
                ret[e.id] = {...ret[e.id], status: true}
            else {
                ret[e.id] = {...ret[e.id], status: false, err}
                errored = true
            }
        }))

        if(errored)
            res.status(400)
        return ret
    },
    {
        body: S.object()
            .prop("editedItems", S.array().items(
                S.object()
                    .prop("id", S.string()).required()
                    .prop("title", S.string())
                    .prop("price", S.integer().minimum(0))
                    .prop("stock", S.integer().minimum(0))
                    .prop("description", S.string())
                    .prop("category", S.string())
            )).required()
    }
)

async function getProducts() {
    return await getProductList({})
}

export async function updateItem(e: any) {
    const update_object = JSON.parse(JSON.stringify(e))
    delete update_object.id

    try {
        await ProductModel.findByIdAndUpdate(e.id, {"$set": update_object})
        return null
    } catch (ex) {
        return ex
    }
}