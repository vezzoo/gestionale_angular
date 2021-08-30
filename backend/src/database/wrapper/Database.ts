import Mongoose from "mongoose";
import DatabaseModelDefinition from "./Definitions";

export default class Database{
    private static db?: typeof Mongoose = undefined

    private constructor() {}

    public static async connect(uri: string): Promise<typeof Mongoose>{

        if(this?.db)
            return this.db;

        this.db = await Mongoose.connect(uri as string, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        return this.db
    }

    public static async disconnect(){
        if(!this.db)
            return;
        await Mongoose.disconnect()
    }

    public static get(){
        if(!this.db)
            throw Error("Not yet connected.")
        return this.db;
    }

    private static models: {[model: string]: DatabaseModelDefinition} = {}
    public static getModel(model: string): DatabaseModelDefinition{
        if(!this.models[model]) this.models[model] = new DatabaseModelDefinition()
        return this.models[model]
    }
    public static setModel(model: string, def: DatabaseModelDefinition){
        this.models[model] = def
    }
}