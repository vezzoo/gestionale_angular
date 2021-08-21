import "reflect-metadata"
import Database from "../Database";
import {Schema} from "mongoose";
import "reflect-metadata"

export default function(target: any, key: string) {
    Database.getModel(target.constructor.name).add_definition(key, "type", Schema.Types.ObjectId)
    Database.getModel(target.constructor.name).addDocumentRef(key, Reflect.getMetadata("design:type", target, key))
}
