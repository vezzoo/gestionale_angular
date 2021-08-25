import "reflect-metadata"
import Database from "../Database";
import {Schema} from "mongoose";
import "reflect-metadata"

export default function(target: any, key: string) {
    Database.getModel(target.constructor.name).add_definition(key, "type", Schema.Types.ObjectId)
    Database.getModel(target.constructor.name).addDocumentRef(key, Reflect.getMetadata("design:type", target, key))
}

export function RefArray(item_ref: any): (target: any, key: string) => void {
    return (target: any, key: string) => {
        Database.getModel(target.constructor.name).add_definition(key, "type", [Database.getModel(item_ref.constructor.name).getSchema()])
        Database.getModel(target.constructor.name).addDocumentRef(key, item_ref)
    }
}
