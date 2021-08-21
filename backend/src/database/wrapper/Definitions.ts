import Mongoose from "mongoose";

export default class DatabaseModelDefinition{
    get schema_definition(): { [p: string]: any } {
        return this._schema_definition;
    }

    get model_references(): { [p: string]: any } {
        return this._model_references;
    }

    private _schema_definition: {[p: string]: any} = {}
    private schema_options: {[p: string]: any} = {}
    private model?: Mongoose.Model<any, any, any> | null
    private default_populate_list: string[] = []
    private _model_references: {[local_field: string]: Function} = {}

    public add_definition(field: string, property: string, value: any) {
        if(!this._schema_definition[field]) this._schema_definition[field] = {}
        Object.assign(this._schema_definition[field], {[property]: value})
    }

    public add_option(field: string, value: any) {
        if(!this.schema_options[field]) this.schema_options[field] = {}
        Object.assign(this.schema_options, {[field]: value})
    }

    public getModel(name: string){
        if(!this.model) this.model = Mongoose.model<any>(name, new Mongoose.Schema(this._schema_definition))
        return this.model
    }

    public addDefaultPopulate(field: string){
        //if(!this._model_references[field]) return
        this.default_populate_list.push(field)
    }

    public getPopulateList(list: string[]){
        return [...this.default_populate_list, ...list].filter((e, i, a) => a.indexOf(e) === i)
    }

    public addDocumentRef(field: string, model_reference: any){
        if(!model_reference.model_name) return
        this._model_references[field] = model_reference
        this.add_definition(field, "ref", model_reference.model_name())
    }
}