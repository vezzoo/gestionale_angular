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
    "POST",
    "/reset/",
    async (req, res, user, body) => {
        await OrderManager.getInstance().reset(1)
        console.info(`User ${user.username} reset the order count to 0001`)
        return {status: true}
    },
    {}
)