const ErrorCode = (code: number, message: string, doc: string) => (target: any, propertyKey: string) => {
    target[propertyKey] = ECODE.ERR_RETURN(code, propertyKey, message, doc)
}

export interface ErrorCode{
    code: number;
    data: {status: boolean, ecode: string, message: string, aux: any};
    documentation: string;
}


export default class ECODE{
    public static ERR_RETURN(code: number, ecode: string, message: string, documentation: string, aux?:any): ErrorCode{
        return {code, data: {status: false, message, ecode, aux}, documentation: process.env.DOCGEN === "1" ? documentation : ""}
    }

    public static E_UNCOMMON(code: number, message: string, aux?: any): ErrorCode{
        return this.ERR_RETURN(code, "E_UNCOMMON", message, "", aux)
    }

    public static get(s: string): ErrorCode{
        // @ts-ignore
        if(this[s]) return this[s]
        throw Error("Unexistent code " + s)
    }

    @ErrorCode(404, "Not Found", "resource has not been found")
    public static readonly E_NOT_FOUND: ErrorCode;
    @ErrorCode(406, "Validation error", "supplied parameters do not respect validation policy")
    public static readonly E_VALIDATION: ErrorCode
    @ErrorCode(403, "Malformed request", "something gone really wrong with the request")
    public static readonly E_MALFORMED_REQ: ErrorCode
    @ErrorCode(403, "invalid jwt token", "invalid jwt token")
    public static readonly E_JWT_INVALID: ErrorCode
    @ErrorCode(406, "no usr found into the database", "no usr has been found in the database")
    public static readonly E_NO_USER: ErrorCode
    @ErrorCode(403, "Authentication error", "Authentication error")
    public static readonly E_AUTH: ErrorCode
    @ErrorCode(403, "permission error", "usr does not have the right permission")
    public static readonly E_PERM: ErrorCode
    @ErrorCode(423, "timeout", "A mutex call hit the timeout")
    public static readonly E_TIMEOUT: ErrorCode
    @ErrorCode(406, "Duplicate entry", "tried to add a duplicated unique entry into the database")
    public static readonly E_DUP: ErrorCode

    @ErrorCode(403, "Jwt expired", "tried to add a duplicated unique entry into the database")
    public static readonly E_JWT_EXPIRED: ErrorCode
    @ErrorCode(406, "Duplicate entry", "tried to add a duplicated unique entry into the database")
    public static readonly E_NO_JWT: ErrorCode
}