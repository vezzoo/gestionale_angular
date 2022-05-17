import { DashboardCategory } from "./@types/dashboard";
import {UserPermission} from "./@types/permissions";
import { Printer } from "./@types/printer";

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

export const SETTING_USER_PERM: UserPermission[] = [
    "user_management",
    "storage_write",
    "storage_read",
    "cash_desk",
    "cash_desk_bar",
    "cash_desk_takeaway",
    "reports",
    "reset_counter",
    // "show_orders",
    // "printers_management"
]

export const SETTING_PRINTERS: Printer[] = [
    {
        name: "http://192.168.1.2:3001/api/cucina1/order",
        category_filter: ["CUCINA"]
    },
    {
        name: "http://192.168.1.2:3001/api/cucina2/order",
        category_filter: ["PIZZA"]
    }
]

export const SETTING_DASHBOARD_FUNCTIONS: DashboardCategory[] = [
    {
        title: "cassa",
        children: [
            {
                title: "Standard",
                permissions: ["cash_desk"],
                icon: "shopping_cart",
                description: "Cassa completa",
            },
            {
                title: "Bar",
                permissions: ["cash_desk_bar"],
                icon: "local_bar",
                description: "Cassa solo bar e caffe",
            },
            {
                title: "Asporto",
                permissions: ["cash_desk_takeaway"],
                icon: "card_travel",
                description: "Cassa completa, solo asporto",
            },
        ],
    },
    {
        title: "gestione",
        children: [
            {
                title: "Magazzino",
                permissions: ["storage_write", "storage_read"],
                icon: "store",
                description: "Gestione prodotti e giacenze",
            },
            {
                title: "Reports",
                permissions: ["reports"],
                icon: "equalizer",
                description: "Download dati statistici",
            },
            // {
            //     title: "Vis. ordini",
            //     permissions: ["show_orders"],
            //     icon: "fact_check",
            //     description: "Visualizzazione e ristampa ordini",
            // },
        ],
    },
    {
        title: "amministrazione",
        children: [
            {
                title: "Gestione utenti",
                permissions: ["user_management"],
                icon: "account_circle",
                description: "Creazione/modifica utenti",
            },
            {
                title: "Chiusura giornata",
                permissions: ["reset_counter"],
                icon: "restart_alt",
                description: "Reset del contatore",
            },
            // {
            //     title: "Gestione stampanti",
            //     permissions: ["printers_management"],
            //     icon: "print",
            //     description: "Visualizza lo stato delle stampanti",
            // },
        ]
    },
]
