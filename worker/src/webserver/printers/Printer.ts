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
import * as fs from "fs";
import {sleep} from "../../_utils";

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

function convert(template: string, options: any): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        pdf.create(template, options).toBuffer(function (err: any, data: Buffer) {
            if (err)
                return reject(err)
            console.log(template)
            fs.writeFileSync("debug.pdf", data)
            resolve(data)
        })
    })
}

function getPrinterStatus(printer: any): Promise<any> {
    return new Promise((resolve, reject) => {
        printer.execute(
            "Get-Printer-Attributes",
            null,
            function (err: any, printerStatus: any) {
                if (err) return reject(err)
                resolve(printerStatus)
            }
        )
    })
}

function print(printer: any, data: Buffer, request_user: string, job_name: string, retries: number = 50, retry_interval_ms: number = 2000): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        printer.execute(
            "Print-Job",
            {
                "operation-attributes-tag": {
                    "requesting-user-name": request_user,
                    "job-name": job_name,
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
                                if (err2) return reject(err2);
                                tries++;
                                if (
                                    job &&
                                    job["job-attributes-tag"]["job-state"] == "completed"
                                ) {
                                    clearInterval(t);
                                    return resolve()
                                }
                                if (tries > retries) {
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
                    }, retry_interval_ms);
                } else {
                    return reject()
                }
            }
        )
    })
}

export default function Printer(printername: string, cupsname: string, title: string) {
    return new Endpoint(printername)
        .addCallback(new CorsApiCall(
            "POST",
            "/order",
            async (req, res, body) => {
                const payload = jwt.verify(body.payload, SETTING_JWT_PUBLIC) as any
                console.log(JSON.stringify(payload))

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
                    p = p.replace("%QTA%", "" + e.qta)
                    p = p.replace("%NAME%", "" + e.product.title)
                    products += p + "\n"
                })
                template = template.replace("%PRODUCTLIST%", products)

                const doc = await convert(template, {format: 'A4'});

                const printer_url = `ipp://${SETTING_CUPS_SERVER}:631/printers/${cupsname}`
                console.log(`Waiting for printer ${printer_url} to idle`)
                const printer = ipp.Printer(printer_url)
                let tries = 100;
                while (tries-- > 0){
                    const status = await getPrinterStatus(printer)
                    console.log(status)
                    if (status["printer-attributes-tag"] && status["printer-attributes-tag"]["printer-state"] === "idle") {
                        await print(printer, doc, printername, payload.code)
                        break;
                    }
                    console.log("Printer busy")
                    await sleep(1000);
                }

                return {status: tries > 0}
            },
            {
                body: S.object().prop("payload", S.string())
            }
        ))
}