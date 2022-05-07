import Endpoint from "../Endpoint";
import create from "./orders/create";
import reset from "./orders/reset";
import list from "./orders/list";

export default new Endpoint("/order")
    .addCallback(create)
    .addCallback(reset)
    .addCallback(list)