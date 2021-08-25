import Endpoint from "../Endpoint";
import create from "./orders/create";

export default new Endpoint("/order")
    .addCallback(create)