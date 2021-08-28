import Endpoint from "../Endpoint";
import create from "./orders/create";
import reset from "./orders/reset";

export default new Endpoint("/order")
    .addCallback(create)
    .addCallback(reset)