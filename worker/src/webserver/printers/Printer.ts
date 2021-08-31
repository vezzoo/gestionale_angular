import Endpoint from "../Endpoint";
import ApiCall from "../apicalls/ApiCall";
import S from "fluent-json-schema"
import {SETTING_JWT_PUBLIC} from "../../settings";
import jwt from "jsonwebtoken"

export default function Printer (printername:string, ip: string){
    return new Endpoint(printername)
        .addCallback(new ApiCall(
            "POST",
            "/order",
            async (req, res, body) => {
                const payload = jwt.verify(body.payload, SETTING_JWT_PUBLIC) as any
                console.log(payload)
            },
            {
                body: S.object().prop("payload", S.string())
            }
        ))
}