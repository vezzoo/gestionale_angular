import S from "fluent-json-schema";
import MutexAuthApiCall from "../../apicalls/MutexAuthApiCall";
import Product from "../../../database/models/Product.model";
import ECODE from "../../ECODE";
import jwt from "jsonwebtoken"
import {SETTING_JWT_PRIVATE, SETTING_JWT_PUBLIC, SETTING_PRINTERS, SETTING_TOKEN_EXPIRE_HOURS} from "../../../settings";
import Order from "../../../database/models/Orders.model";
import OrderManager from "../../OrderManager";
import AuthApiCall from "../../apicalls/AuthApiCall";
import {generate_print_list} from "./_utils";
import ProductModel from "../../../database/models/Product.model";
import User from "../../../database/models/User.model";

async function return_data_JSON(data: Order[], printlist: boolean) {
    return {
        list: data.map((e: Order) => {
            return {
                code: e.code,
                notes: e.notes,
                takeaway: e.takeaway,
                printList: printlist ? generate_print_list(e, 0) : undefined,
                user: e.user.username,
                content: e.products.map((v, i) => ({title: v.title, qta: e.quantities[i]}))
            }
        })
    }
}

async function return_data_CSV(data: Order[], printlist: boolean) {
    const products: any = {}
    const amounts: any = {}

    data.forEach((e) => {
        e.products.forEach((p, i) => {
            if(!products[p?._id?.toString() || "err"])
                products[p?._id?.toString() || "err"] = p

            if(!amounts[p?._id?.toString() || "err"])
                amounts[p?._id?.toString() || "err"] = 0
            amounts[p?._id?.toString() || "err"] += e.quantities[i]
        })
    })

    return "Descrizione;P.unit;Q.tà;P.tot\n" +
        Object.keys(products)
        .map(e => `${products[e].title};${(products[e].price / 100).toFixed(2)};${amounts[e]};${((products[e].price*amounts[e]) / 100).toFixed(2)}`.replace('.', ',').replace('.', ','))
        .sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;

            return 0;
        })
        .join("\n")
}

async function return_data(fmt: string, data: Order[], printlist: boolean) {
    switch (fmt) {
        case "JSON":
            return return_data_JSON(data, printlist)
        case "CSV":
            return return_data_CSV(data, printlist)
        default:
            return ECODE.E_MALFORMED_REQ
    }
}
/*
call: GET /api/order/<format>/<filter>?to=1630069795720&from=1630059795720&printlist=true

to: unixtimestamp di arrivo per il filtro degli ordini. se non presente viene utilizzata l'ora corrente della chiamata
from: unixtimestamp di partenza per il filtro degli ordini. se non presente è 0
printlist: solo per formato JSON (Vedi sotto), aggiunge il campo print list per eventuale ristampa.

FILTER: Filtra gli ordini per codice per ottenere un solo ordine. se undefined viene ignorato
FORMAT: Determina il formato dell'output:
    JSON:   Formato json con la descrizione degli ordini e i dati relativi.
            EX: {
                "list": [
                    {
                      "code": "...",
                      "notes": "...",
                      "user": "..."
                      "takeaway": false,
                      "printList": [ ... ],
                      "content": [
                        {
                          "title": "...",
                          "qta": ...
                        }
                      ]
                    },
                    ...
                    ...
                 ]
              }
    CSV:    Formato csv con la lista di tutti i prodotti venduti e le quantità cumulative
            EX:
                ID;                         TITLE;      CATEGORY;   UNITPRICE;  QTA;    TOT
                61262876a82bbf5071f5332d;   cetriolo;   CUCINA;     6.00;       9;      54.00
                6124e3629cc9d237033f0711;   Banananita; lolll;      6.00;       2;      12.00
 */
export default new AuthApiCall(
    "cash_desk",
    "GET",
    "/:format/:filter",
    async (req, res, user, body, headers, params) => {

        const from = new Date((req.query as any).from).toISOString()
        const to = (req.query as any).to ? new Date((req.query as any).to).toISOString() : new Date().toISOString()

        const requested = await Order.find(Object.assign(params.filter ? {code: params.filter} : {}, {$and: [{createdAt: {$gte: from}}, {createdAt: {$lt: to}}]})) as Order[]
        const products = await ProductModel.find({}) as Product[]

        products.forEach(p => {
            const found = requested.some(o => o.products.some(op => String(op._id) === String(p._id)))
            if (!found) requested.push(new Order("", new User("", "", []), [p], [0], false, ""))
        })

        return return_data(params.format, requested, (req.query as any).printlist)
    },
    {
        params: S.object()
            .prop("format", S.string().enum(["CSV", "JSON"])).required()
            .prop("filter", S.string()),
        querystring: S.object()
            .prop("from", S.integer().minimum(0).default(0))
            .prop("to", S.integer().minimum(0))
            .prop("printlist", S.boolean().default(false))
    }
)