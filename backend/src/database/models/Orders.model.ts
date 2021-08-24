import {model, Model, ObjectId, Schema, Document} from "mongoose";
import Collection from "../wrapper/decorators/Collection";
import DBDocument from "../wrapper/DBDocument";
import Field, {FieldArray} from "../wrapper/decorators/Field";
import Required from "../wrapper/decorators/Required";
import Default from "../wrapper/decorators/Default";
import Unique from "../wrapper/decorators/Unique";
import Product from "./Product.model";
import Ref, {RefArray} from "../wrapper/decorators/Ref";

@Collection
export default class Order extends DBDocument {
    constructor(code: string, products: Product[]) {
        super();
        this.code = code
        this.products = products
    }

    public _id?: ObjectId
    public __v?: number

    @Field
    @Required
    @Unique
    public code?: string

    @RefArray(Product)
    public products?: Product[]
}
