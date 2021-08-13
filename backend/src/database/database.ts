import Mongoose from "mongoose";
import {SETTING_MONGO_URL} from "../settings"
import assert from "node:assert";

export default class Database{
    private static db: null | typeof Mongoose = null

    private constructor() {}

    public static async connect(uri?: string): Promise<typeof Mongoose>{
        if(!uri)
            uri = SETTING_MONGO_URL;

        if(this.db !== null)
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
        assert.ok(this.db === null)
        return this.db;
    }
}