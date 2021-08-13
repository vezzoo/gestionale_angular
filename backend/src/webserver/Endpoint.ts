import {FastifyInstance, FastifyReply, FastifyRequest, RouteOptions} from "fastify";
import AbstractCall from "./apicalls/AbstractApiCall";

export default class Endpoint{
    protected base_path: string;
    private eps: (AbstractCall | RouteOptions)[] = [];

    constructor(base_path: string) {
        this.base_path = base_path;
    }


    public static codereturn(res: FastifyReply | null, code: number, data: any): any {
        if (res) res.status(code);
        return data;
    }

    public static secureCallback(callback: (req: FastifyRequest, res: FastifyReply) => any) {
        return async (req: FastifyRequest, res: any) => {
            //@ts-ignore
            if (req.validationError) return Endpoint.codereturn(res,400, Object.assign(ECODE.E_VALIDATION.data, {aux: req.validationError.message}))
            return await callback(req, res);
        }
    }

    public addCallback(cb: AbstractCall | Endpoint): Endpoint {
        if(cb instanceof AbstractCall) return this._add_call(cb)
        return this._add_ep(cb)
    }

    private _add_call(cb: AbstractCall|RouteOptions){
        if(cb instanceof AbstractCall) {
            cb.setUrl(`/${this.base_path}${cb.getCallback().url}`)
            this.eps.push(cb);
            cb.aliases.forEach(e => {
                console.info(`Registring alias call : (${cb.getCallback().method}) /${this.base_path}${cb.getCallback().url} => (${e.method}) /${this.base_path}${e.url}`)
                e.url = `/${this.base_path}${e.url}`
                this.eps.push(e);
            })
            return this;
        }
        cb.url = `/${this.base_path}/${cb.url}`
        this.eps.push(cb);
        return this;
    }

    private _add_ep(cb: Endpoint){
        cb.eps.forEach(e => {
            this._add_call(e);
        })
        cb.base_path = `/${this.base_path}/${cb.base_path}`
        return this;
    }

    _add(server: FastifyInstance, base_path: string): void {
        this.eps.forEach(e => {
            const call = e instanceof AbstractCall ? e.getCallback() : e;
            call.url = (base_path + call.url).replace(/\/\//g, "/")
            console.log("Loading endpoint " + call.method + " " + call.url);
            server.route(call)
        });
    }
}