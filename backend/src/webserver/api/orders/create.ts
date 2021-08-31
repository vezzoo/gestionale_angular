import S from "fluent-json-schema";
import MutexAuthApiCall from "../../apicalls/MutexAuthApiCall";
import Product from "../../../database/models/Product.model";
import ECODE from "../../ECODE";
import jwt from "jsonwebtoken"
import {SETTING_JWT_PRIVATE, SETTING_JWT_PUBLIC, SETTING_PRINTERS, SETTING_TOKEN_EXPIRE_HOURS} from "../../../settings";
import Order from "../../../database/models/Orders.model";
import OrderManager from "../../OrderManager";

export default new MutexAuthApiCall(
    "cash_desk",
    "PUT",
    "/",
    async (req, res, user, body) => {
        const ids = Object.keys(body.cart).map((e: any) => ({_id: e}))
        const products = (await Product.find({$or: ids}) as Product[]).map(e => ({
            product: e,
            qta: body.cart[e?._id?.toString() || ""]
        })).filter(e => !!e.qta)

        let price = 0;
        let code = ("0000" + OrderManager.getInstance().getOrderNumber()).substr(-4)

        for (let product of products) {

            if (product.product.stock < product.qta)
                return ECODE.get("E_NO_STOCK", {
                    id: product.product?._id?.toString(),
                    name: product.product.title,
                    stock: product.product.stock,
                    qta: product.qta
                })

            price += product.product.price * product.qta
            product.product.stock -= product.qta
        }

        const order =  new Order(code, user, products.map(e => e.product), products.map(e => e.qta), body.takeaway, body.notes)
        await order.save()

        const printList = SETTING_PRINTERS
            .map((e: any) => (
                {
                    name: e.name,
                    category_filter: e.category_filter,
                    list: products
                        .filter(v => e.category_filter.includes(v.product.category))
                        .map(e => ({product: e.product.getObject(), qta: e.qta}))
                }))
            .filter(e => e.list.length > 0)
            .map(e => ({
                name: e.name,
                payload: jwt.sign({
                    cart: e.list,
                    code,
                    takeaway: body.takeaway,
                    notes: body.notes,
                    total: price
                }, SETTING_JWT_PRIVATE, {
                    algorithm: 'ES256',
                    expiresIn: SETTING_TOKEN_EXPIRE_HOURS
                })
        }))



        return {
            code,
            price,
            printList
        }
    },
    {
        body: S.object()
            .prop("notes", S.string())
            .prop("takeaway", S.boolean())
            .prop("cart", S.object()
                .minProperties(1) //no ordini vuoti
                .patternProperties({"^[a-z0-9]{24}$": S.integer().minimum(1)})
                .additionalProperties(false)
            ).required()
    }
)