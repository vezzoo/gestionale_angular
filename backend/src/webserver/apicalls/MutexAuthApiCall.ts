import AuthApiCall from "./AuthApiCall";
import {UserPermission} from "../../@types/permissions";
import {FastifyReply, FastifyRequest, FastifySchema, HTTPMethods} from "fastify";
import {IUserDocument} from "../../database/models/User.model";
import {Mutex, withTimeout, E_TIMEOUT} from "async-mutex"
import ECODE from "../ECODE";

export default class MutexAuthApiCall extends AuthApiCall{
    private readonly mutex;

    constructor(
        permission: UserPermission | UserPermission[] | null,
        method: HTTPMethods,
        url: string,
        handler: (req: FastifyRequest, res: FastifyReply, user: IUserDocument, body: any, headers: any, parameters: any, end_lock: () => void) => any,
        schema: FastifySchema,
        fallback?: (req: FastifyRequest, res: FastifyReply, err: Error) => any,
        timeout?: number)
    {
        super(
            permission,
            method,
            url,
            async (req, res, user, body, headers, parameters) => {
                try {
                    await this.mutex.acquire();
                    const ret = await handler(req, res, user, body, headers, parameters, () => {this.mutex.release()})
                    if(this.mutex.isLocked())
                        this.mutex.release()
                    return ret
                } catch (e) {
                    if(e === E_TIMEOUT)
                        return ECODE.E_TIMEOUT
                    else
                        return ECODE.E_UNCOMMON(500, "generic error", e)
                }
            },
            schema,
            fallback,
        );

        if(timeout)
            this.mutex = withTimeout(new Mutex(), timeout)
        else
            this.mutex = new Mutex();
    }
}