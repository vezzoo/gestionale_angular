import Endpoint from "../Endpoint";
import create from "./user/create";
import login from "./user/actions/login";
import edit from "./user/edit";
import list from "./user/list";

export default new Endpoint("/usr")
    .addCallback(create)
    .addCallback(login)
    .addCallback(edit)
    .addCallback(list)