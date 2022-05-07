import {FastifyReply, FastifyRequest, FastifySchema, HTTPMethods} from "fastify";
import AbstractCall from "./AbstractApiCall";
import Endpoint from "../Endpoint";

export default class ApiCall extends AbstractCall {
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
            handler: Endpoint.secureCallback(async (req: FastifyRequest, res: FastifyReply) => await AbstractCall.default_handler(req, res, handler))
        })
    }
}