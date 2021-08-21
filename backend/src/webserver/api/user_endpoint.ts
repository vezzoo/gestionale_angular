import Endpoint from "../Endpoint";
import create from "./usr/create";
import login from "./usr/actions/login";
import edit from "./usr/edit";
import list from "./usr/list";

export default new Endpoint("/usr")
    .addCallback(create)
    .addCallback(login)
    .addCallback(edit)
    .addCallback(list)