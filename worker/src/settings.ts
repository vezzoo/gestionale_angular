import * as fs from "fs";

export const SETTING_JWT_PUBLIC = "-----BEGIN PUBLIC KEY-----\n" +
    "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEdeOJLk6VSNn1s5D2gLFYHCWuZ3LjNKGQ\n" +
    "tIwUbtbUIlVuZwYyUsVroLJm25F83UT5q7htlXoQbqcbqK01gR+zbw==\n" +
    "-----END PUBLIC KEY-----\n"

export const SETTING_API_ROOT = "/api"
export const SETTING_WEBSERVER_HTTP_PORT = 3001
export const SETTING_WEBSERVER_BIND = "0.0.0.0"

export const SETTING_PID_FILE = "./pid"

export const SETTING_CORS_ORIGIN = "*"

export const SETTING_TEMPLATE = fs.readFileSync("../templates/template.html", {encoding: "utf8"})
export const SETTING_NOTES = fs.readFileSync("../templates/notes.html", {encoding: "utf8"})
export const SETTING_TAKEAWAY = fs.readFileSync("../templates/takeaway.html", {encoding: "utf8"})
export const SETTING_PRODUCT = fs.readFileSync("../templates/product.html", {encoding: "utf8"})

export const SETTING_CUPS_SERVER = "127.0.0.1"
export const SETTING_PRINTERS = [
    {
        "name": "cucina1",
        "printer": "casa"
    }
]
