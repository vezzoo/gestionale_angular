import Order from "../../../database/models/Orders.model";
import {SETTING_JWT_PRIVATE, SETTING_PRINTERS, SETTING_TOKEN_EXPIRE_HOURS} from "../../../settings";
import jwt from "jsonwebtoken";

export function generate_print_list(order: Order, price: number){
    return SETTING_PRINTERS
        .map((e: any) => (
            {
                name: e.name,
                category_filter: e.category_filter,
                list: order.products
                    .map((e, i) => ({product: e.getObject(), qta: order.quantities[i]}))
                    .filter((v) => e.category_filter.includes(v.product.category))
            }))
        .filter(e => e.list.length > 0)
        .map(e => ({
            name: e.name,
            payload: jwt.sign({
                cart: e.list,
                code: order.code,
                takeaway: order.takeaway,
                notes: order.notes,
                total: price
            }, SETTING_JWT_PRIVATE, {
                algorithm: 'ES256',
                expiresIn: SETTING_TOKEN_EXPIRE_HOURS
            })
        }))
}