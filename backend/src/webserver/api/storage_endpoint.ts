import Endpoint from "../Endpoint";
import create from "./storage/create";
import edit from "./storage/edit";
import list from "./storage/list";
import delete_ep from "./storage/delete";


export default new Endpoint("/storage")
    .addCallback(create)
    .addCallback(edit)
    .addCallback(list)
    .addCallback(delete_ep)