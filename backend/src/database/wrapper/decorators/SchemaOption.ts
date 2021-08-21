import Database from "../Database";
import "reflect-metadata"

export default function (attribute: string, value: any): (constructor: any) => any {
    return (constructor: Function) => {
        Database.getModel(constructor.name).add_option(attribute, value)
        return constructor
    }
}