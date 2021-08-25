import S from "fluent-json-schema";
import MutexAuthApiCall from "../../apicalls/MutexAuthApiCall";
import Product from "../../../database/models/Product.model";
import ECODE from "../../ECODE";
import jwt from "jsonwebtoken"
import {SETTING_JWT_PRIVATE, SETTING_JWT_PUBLIC, SETTING_TOKEN_EXPIRE_HOURS} from "../../../settings";
import Order from "../../../database/models/Orders.model";

export default new MutexAuthApiCall(
    "cash_desk",
    "PUT",
    "/",
    async (req, res, user, body) => {
        const ids = Object.keys(body.cart).map((e: any) => ({_id: e}))
        const products = await Product.find({$or: ids}) as Product[]

        let price = 0;
        let code = Math.random().toString(26).substr(2) //TODO LO SO

        for (let product of products) {
            const qta = body.cart[product?._id?.toString() || ""] || 0

            if (product.stock < qta)
                return ECODE.get("E_NO_STOCK", {
                    id: product?._id?.toString(),
                    name: product.title,
                    stock: product.stock,
                    qta
                })

            price += product.price * qta
            product.stock -= qta
        }

        const order =  new Order(code, user, products, products.map((e: any) => body.cart[e?._id.toString()]))
        await order.save()

        //todo determinazione print list da settings
        const printLists: any = {
            cucina: jwt.sign({
                code,
                list: products.map((e: any) => ({product: e, qta: body.cart[e._id.toString()]}))
            }, SETTING_JWT_PRIVATE, {
                algorithm: 'ES256',
                expiresIn: SETTING_TOKEN_EXPIRE_HOURS
            })
        }

        //TEST
        Object.keys(printLists).forEach((e: string) => console.log(jwt.verify(printLists[e], SETTING_JWT_PUBLIC)))
        //ENDTEST

        return {
            code,
            price,
            printLists
        }
    },
    {
        body: S.object()
            .prop("cart", S.object()
                .minProperties(1) //no ordini vuoti
                .patternProperties({"^[a-z0-9]{24}$": S.integer().minimum(1)})
                .additionalProperties(false)
            ).required()
    }
)