import Endpoint from "../Endpoint";
import S from "fluent-json-schema"
import {
    SETTING_CUPS_SERVER,
    SETTING_JWT_PUBLIC,
    SETTING_NOTES,
    SETTING_PRODUCT,
    SETTING_TAKEAWAY,
    SETTING_TEMPLATE
} from "../../settings";
import * as jwt from "jsonwebtoken"
import CorsApiCall from "../apicalls/CorsApiCall";
const pdf = require("html-pdf")
const ipp = require("ipp")

//{
//   "cart": [
//     {
//       "product": {
//         "title": "Pane e salamella",
//         "price": 300,
//         "category": "CUCINA",
//         "stock": 999,
//         "_id": "612e7e276e81d125b80f0f69"
//       },
//       "qta": 1
//     }
//   ],
//   "code": "0002",
//   "notes": "",
//   "total": 300,
//   "iat": 1630439983,
//   "exp": 1630454383
// }

export default function Printer(printername: string, cupsname: string, title: string) {
    return new Endpoint(printername)
        .addCallback(new CorsApiCall(
            "POST",
            "/order",
            async (req, res, body) => {
                const payload = jwt.verify(body.payload, SETTING_JWT_PUBLIC) as any
                console.log(payload)

                let template = SETTING_TEMPLATE
                template = template.replace("%TITLE%", title)
                template = template.replace("%ORDNUM%", payload.code)

                if (!!payload.notes) {
                    let notes = SETTING_NOTES
                    notes = notes.replace("%TEXT%", payload.notes)
                    template = template.replace("%NOTES%", notes)
                } else
                    template = template.replace("%NOTES%", "")

                if (!!payload.takeaway) {
                    template = template.replace("%TAKEAWAY%", SETTING_TAKEAWAY)
                } else
                    template = template.replace("%TAKEAWAY%", "")

                let products = ""
                payload.cart.forEach((e: any) => {
                    let p = SETTING_PRODUCT
                    p = p.replace("%QTA%", "" + payload.qta)
                    p = p.replace("%NAME%", "" + payload.product.title)
                    products += p + "\n"
                })
                template = template.replace("%PRODUCTLIST%", products)

                let status = true
                pdf.create(template, {format: 'A4'}).toStream(function (err: any, data: Buffer) {
                    if (err) {
                        status = false
                        return console.log(err);
                    }

                    const printer_url = `ipp://${SETTING_CUPS_SERVER}:631/printers/${cupsname}`
                    const printer = ipp.Printer(printer_url)
                    printer.execute(
                        "Get-Printer-Attributes",
                        null,
                        function (err: any, printerStatus: any) {
                            if (printerStatus["printer-attributes-tag"]["printer-state"] == "idle") {
                                printer.execute(
                                    "Print-Job",
                                    {
                                        "operation-attributes-tag": {
                                            "requesting-user-name": printername,
                                            "job-name": "" + payload.code,
                                        },
                                        "job-attributes-tag": {},
                                        data,
                                    },
                                    function (err: any, res: any) {
                                        if (res.statusCode == "successful-ok") {
                                            const jobUri = res["job-attributes-tag"]["job-uri"];
                                            let tries = 0;
                                            let t = setInterval(function () {
                                                printer.execute(
                                                    "Get-Job-Attributes",
                                                    {"operation-attributes-tag": {"job-uri": jobUri}},
                                                    function (err2: any, job: any) {
                                                        if (err2) throw err2;
                                                        tries++;
                                                        if (
                                                            job &&
                                                            job["job-attributes-tag"]["job-state"] == "completed"
                                                        ) {
                                                            clearInterval(t);
                                                        }
                                                        if (tries > 50) {
                                                            clearInterval(t);
                                                            printer.execute(
                                                                "Cancel-Job",
                                                                {
                                                                    "operation-attributes-tag": {
                                                                        "printer-uri": printer.uri, //or uncomment this two lines - one of variants should work!!!
                                                                        "job-id": job["job-attributes-tag"]["job-id"],
                                                                    },
                                                                },
                                                                function (err: any, res: any) {
                                                                }
                                                            );
                                                        }
                                                    });
                                            }, 2000);
                                        } else {
                                            status = false;
                                            return
                                        }
                                    }
                                )
                            }
                        }
                    )
                });
            },
            {
                body: S.object().prop("payload", S.string())
            }
        ))
}