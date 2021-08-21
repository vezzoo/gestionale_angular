import Database from "../Database";
import "reflect-metadata"

export default function (value: any): (target: any, key: string) => void {
    return (target: any, key: string) => Database.getModel(target.constructor.name).add_definition(key, "default", value)
}