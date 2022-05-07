import {FastifyReply, FastifyRequest, FastifySchema, HTTPMethods} from "fastify";
import AbstractCall from "./AbstractApiCall";
import Endpoint from "../Endpoint";
import {SETTING_CORS_ORIGIN} from "../../settings";

export default class CorsApiCall extends AbstractCall {
    constructor(
        method: HTTPMethods,
        url: string,
        handler: (req: FastifyRequest, res: FastifyReply, body: any, headers: any, parameters: any) => any,
        schema: FastifySchema,) {

        super({
            method,
            url,
            schema,
            attachValidation: true,
            handler: Endpoint.secureCallback(async (req: FastifyRequest, res: FastifyReply) => {
                const ret = await AbstractCall.default_handler(req, res, handler)
                res.header("Access-Control-Allow-Origin", SETTING_CORS_ORIGIN)
                return ret
            })
        })
    }
}