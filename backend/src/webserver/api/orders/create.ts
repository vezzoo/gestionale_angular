import S from "fluent-json-schema";
import MutexAuthApiCall from "../../apicalls/MutexAuthApiCall";
import Product from "../../../database/models/Product.model";
import ECODE from "../../ECODE";
import jwt from "jsonwebtoken"
import {SETTING_JWT_PRIVATE, SETTING_JWT_PUBLIC, SETTING_PRINTERS, SETTING_TOKEN_EXPIRE_HOURS} from "../../../settings";
import Order from "../../../database/models/Orders.model";
import OrderManager from "../../OrderManager";
import {generate_print_list} from "./_utils";

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

        const order =  new Order(code, user, products.map(e => e.product), products.map(e => e.qta), body.takeAway, body.notes)
        await order.save()

        return {
            code,
            price,
            printList: generate_print_list(order, price)
        }
    },
    {
        body: S.object()
            .prop("notes", S.string())
            .prop("takeAway", S.boolean())
            .prop("cart", S.object()
                .minProperties(1) //no ordini vuoti
                .patternProperties({"^[a-z0-9]{24}$": S.integer().minimum(1)})
                .additionalProperties(false)
            ).required()
            .additionalProperties(false)
    }
)