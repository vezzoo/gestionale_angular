import {ObjectId} from "mongoose";

export default class DBDocument{

    public async save(): Promise<DBDocument>{
        throw Error("Not implemented")
    }

    public static async findById(id: string | ObjectId, populate_list?: string[]): Promise<DBDocument|null>{
        throw Error("Not implemented")
    }

    public static async findByIdAndUpdate(id: string | ObjectId, query: any, populate_list?: string[]): Promise<DBDocument|null>{
        throw Error("Not implemented")
    }

    public static async findOne(query: any, populate_list?: string[]): Promise<DBDocument|null>{
        throw Error("Not implemented")
    }

    public static async find(query: any, populated_fields?: string[]): Promise<DBDocument[]>{
        throw Error("Not implemented")
    }

    public static async delete(id: any): Promise<void>{
        throw Error("Not implemented")
    }

    protected set(e: string, v:any): void{
        //@ts-ignore
        this[e] = v
    }

    protected exists(e: string): boolean{
        //@ts-ignore
        return !!this[e]
    }

    protected get(e: string): any{
        //@ts-ignore
        return this[e]
    }
}