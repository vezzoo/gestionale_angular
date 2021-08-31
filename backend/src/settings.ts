export const SETTING_MONGO_URL = "mongodb://localhost:27017/gestionale"

export const SETTING_JWT_PRIVATE = "-----BEGIN EC PRIVATE KEY-----\n" +
    "MHQCAQEEIJG7fkztFIvqJYyB2oP9aWkDI0fpIq8EzzfqUP7TSCwLoAcGBSuBBAAK\n" +
    "oUQDQgAEdeOJLk6VSNn1s5D2gLFYHCWuZ3LjNKGQtIwUbtbUIlVuZwYyUsVroLJm\n" +
    "25F83UT5q7htlXoQbqcbqK01gR+zbw==\n" +
    "-----END EC PRIVATE KEY-----\n"

export const SETTING_JWT_PUBLIC = "-----BEGIN PUBLIC KEY-----\n" +
    "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEdeOJLk6VSNn1s5D2gLFYHCWuZ3LjNKGQ\n" +
    "tIwUbtbUIlVuZwYyUsVroLJm25F83UT5q7htlXoQbqcbqK01gR+zbw==\n" +
    "-----END PUBLIC KEY-----\n"

export const SETTING_TOKEN_EXPIRE_HOURS = "4h"

export const SETTING_API_ROOT = "/api"
export const SETTING_WEBSERVER_HTTP_PORT = 3000
export const SETTING_WEBSERVER_BIND = "0.0.0.0"
export const SETTING_AUTHENTICATION_HEADER = "Authorization"

export const SETTING_PID_FILE = "./pid"
export const SETTING_ORDER_FILE = "./order"

export const SETTING_CATEGORY = [
    "CUCINA",
    "PIZZA",
    "BAR",
    "CAFFE"
]

export const SETTING_USER_PERM = ["user_management", "storage_write", "storage_read", "cash_desk", "cash_desk_bar", "cash_desk_takeaway", "reports", "reset_counter"]

export const SETTING_PRINTERS = [
    {
        name: "http://raspberrypi.sagrasanlorenzo.it/cucina/print",
        category_filter: ["CUCINA"]
    }
]
