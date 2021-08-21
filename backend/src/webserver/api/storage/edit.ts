import AuthApiCall from "../../apicalls/AuthApiCall";
import S from "fluent-json-schema";
import ProductModel from "../../../database/models/Product.model";
import ECODE from "../../ECODE";

export default new AuthApiCall(
    "storage_write",
    "PATCH",
    "/",
    async (req, res, user, body) => {
        const ret: any = {}
        let errored = false
        await Promise.all(body.editedItems.map(async (e: any) => { //dovrei scrivere dei tipi...
            const update_object = JSON.parse(JSON.stringify(e))
            delete update_object.id
            try {
                await ProductModel.findByIdAndUpdate(e.id, {"$set": update_object})
                ret[e.id] = {status: true}
            } catch (ex) {
                ret[e.id] = {status: false, err: ex}
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