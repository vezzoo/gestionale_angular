import Database from "../Database";
import "reflect-metadata"

export default function (target: any, key: string) {
    Database.getModel(target.constructor.name).add_definition(key, "required", true)
}
