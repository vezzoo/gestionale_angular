import Endpoint from "../Endpoint";
import create from "./user/create";
import login from "./user/actions/login";

export default new Endpoint("/usr")
    .addCallback(create)
    .addCallback(login)