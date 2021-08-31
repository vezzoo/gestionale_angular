import fastify, {FastifyInstance} from "fastify";
import Endpoint from "./Endpoint";
import {SETTING_API_ROOT, SETTING_WEBSERVER_BIND, SETTING_WEBSERVER_HTTP_PORT} from "../settings";
import ECODE from "./ECODE";

export default class Webserver {
    private readonly server: FastifyInstance;

    constructor() {
        this.server = fastify({
            maxParamLength: 1000
        });
    }

    close() {
        this.server.close();
    }

    add(ep: Endpoint): Webserver {
        ep._add(this.server, SETTING_API_ROOT);
        return this;
    }

    exec(): Promise<any> {
        return new Promise<void>((resolve) => {
            this.server.setNotFoundHandler(async (req, res) => {
                res.code(404);
                return ECODE.E_NOT_FOUND.data;
            })
            this.server.setErrorHandler(async (error, req, res) => {
                if(error.validation) return Endpoint.codereturn(res, 406, ECODE.E_VALIDATION.data)
                if(process.env.PRODUCTION !== "1") console.error(error, error.stack)
                res.code(error.statusCode || 500);
                return ECODE.E_UNCOMMON(500, error.code, {aux: process.env.PRODUCTION !== "1" ? error : null}).data;
            })
            this.server.listen(SETTING_WEBSERVER_HTTP_PORT, SETTING_WEBSERVER_BIND).then((e: any) => {
                resolve(e)
            })
            console.info(`Listening on ${SETTING_WEBSERVER_BIND}:${SETTING_WEBSERVER_HTTP_PORT}`)
        });
    }
}
