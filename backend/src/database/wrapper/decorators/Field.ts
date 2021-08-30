import Database from "../Database";
import "reflect-metadata"

export default function(target: any, key: string) {
    Database.getModel(target.constructor.name).add_definition(key, "type", Reflect.getMetadata("design:type", target, key))
}

export function FieldArray(item_type: any): (target: any, key: string) => void {
    return (target: any, key: string) => Database.getModel(target.constructor.name).add_definition(key, "type", [item_type])
}
