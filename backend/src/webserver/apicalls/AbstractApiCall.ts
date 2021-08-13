import {FastifyReply, FastifyRequest, HTTPMethods, RouteOptions} from "fastify";
import Endpoint from "../Endpoint";

export default abstract class AbstractCall{
    protected _obj: RouteOptions;
    private readonly _aliases: RouteOptions[] = [];

    protected constructor(obj: RouteOptions) {
        this._obj = obj;
    }

    get aliases(): RouteOptions[] {
        return this._aliases;
    }

    getCallback(): RouteOptions {
        return this._obj
    }

    setUrl(url: string): void {
        this._obj.url = url;
    }

    addAlias(method: "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "OPTIONS" | HTTPMethods[], url: string): AbstractCall {
        this._aliases.push({
            method,
            url,
            handler: this._obj.handler,
            schema: this._obj.schema,
            attachValidation: this._obj.attachValidation
        })
        return this;
    }

    public static async default_handler(req: FastifyRequest, res: FastifyReply, handler: (req: FastifyRequest, res: FastifyReply, body: any, headers: any, parameters: any) => any) {
        const ret = await handler(req, res, req.body, req.headers, req.params);
        if (ret && ret.code && ret.data) {
            if (!ret.noreturn)
                return Endpoint.codereturn(res, ret.code, ret.data)
            return;
        }
        return ret
    }
}