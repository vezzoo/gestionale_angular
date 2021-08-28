import Database from "../Database";
import DBDocument from "../DBDocument";
import {ObjectId} from "mongoose";

export default function<T extends {new(...args: any[]): DBDocument}>(constructor: T):  T{

    const model_name = constructor.name
    const model = Database.getModel(model_name).getModel(model_name);

    return class extends constructor{
        private instance_document: any;

        public getObject(){
            return Object.keys(Database.getModel(model_name).schema_definition).reduce((a: any, b: string) => {
                a[b] = this.get(b);
                return a
            }, {})
        }

        private update_document(){
            const doc = this.instance_document || {}
            Object.keys(Database.getModel(model_name).schema_definition).forEach((e: string) => {
                if (this.exists(e) && this.get(e) !== doc[e]) {
                    if (Database.getModel(model_name).model_references[e])
                        if(Array.isArray(this.get(e)))
                            doc[e] = this.get(e).map((v: any) => v.getDocument())
                        else
                            doc[e] = this.get(e).getDocument()
                    else
                        doc[e] = this.get(e)
                }
            })
            if(!this.instance_document)
                this.instance_document = new model(doc)
        }

        private update_from_document(){ //todo array support
            Object.keys(this.instance_document._doc).forEach(e => {
                if(Database.getModel(model_name).model_references[e]) {
                    if(Array.isArray(this.instance_document[e])){
                        if (this.instance_document?.populated(e)) {
                            this.set(e, this.instance_document[e].map((v: any, i: number) => new (Database.getModel(model_name).model_references[e])(v)))
                        } else
                            this.set(e, this.instance_document[e])
                    } else {
                        if (this.instance_document?.populated(e)) {
                            this.set(e, new (Database.getModel(model_name).model_references[e])(this.instance_document._doc[e]))
                            this.set(e + "_id", this.instance_document._doc[e]._id)
                        } else
                            this.set(e + "_id", this.instance_document._doc[e])
                    }
                } else
                    this.set(e, this.instance_document._doc[e])
            })
        }

        constructor(...args: any[]) {
            if(args.length === 1 && args[0].constructor.name === "model") {
                super()
                this.instance_document = args[0]
                this.update_from_document()
            } else {
                super(...args)
                this.instance_document = null
                this.update_document()
                this.update_from_document()
            }
        }

        public static async findById(id: string | ObjectId, populated_fields?: string[]) {
            populated_fields = Database.getModel(model_name).getPopulateList(populated_fields || [])
            let doc = model.findById(id)
            populated_fields.forEach(e => doc.populate(e))
            doc = await doc.exec()
            if (!doc) return null
            return new this(doc)
        }

        public static async findByIdAndUpdate(id: string | ObjectId, query: any, populated_fields?: string[]) {
            populated_fields = Database.getModel(model_name).getPopulateList(populated_fields || [])
            let doc = model.findByIdAndUpdate(id, query)
            populated_fields.forEach(e => doc.populate(e))
            doc = await doc.exec()
            if (!doc) return null
            return new this(doc)
        }

        public static async find(query: any, populated_fields?: string[]) {
            populated_fields = Database.getModel(model_name).getPopulateList(populated_fields || [])
            let doc = model.find(query)
            populated_fields.forEach(e => doc.populate(e))
            doc = await doc.exec()
            return doc.map((e: any) => new this(e))
        }

        public static async findOne(query: any, populated_fields?: string[]) {
            populated_fields = Database.getModel(model_name).getPopulateList(populated_fields || [])
            let doc = model.findOne(query)
            populated_fields.forEach(e => doc.populate(e))
            doc = await doc.exec()
            if (!doc) return null
            return new this(doc)
        }

        public static async delete(id: string | ObjectId) {
            await model.findById(id).remove().exec()
        }

        public async save(): Promise<DBDocument>{
            if(!this.instance_document) return this;
            //todo presave

            await Promise.all(Object.keys(Database.getModel(model_name).model_references).map(async (e: string) => {
                if(this.instance_document?.populated(e))
                    if(Array.isArray(this.instance_document[e]))
                        for(let doc of this.get(e))
                            await doc.save()
                    else
                        await this.get(e).save()
            }))
            this.update_document()
            this.instance_document = await this.instance_document.save();
            //todo postsave
            this.update_from_document()
            return this
        }

        public static model_name(){
            return constructor.name
        }

        public getDocument(){
            this.update_document()
            return this.instance_document
        }
    }
}
