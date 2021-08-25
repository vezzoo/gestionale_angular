import {model, Model, ObjectId, Schema, Document} from "mongoose";
import Collection from "../wrapper/decorators/Collection";
import DBDocument from "../wrapper/DBDocument";
import Field, {FieldArray} from "../wrapper/decorators/Field";
import Required from "../wrapper/decorators/Required";
import Default from "../wrapper/decorators/Default";
import Unique from "../wrapper/decorators/Unique";
import Product from "./Product.model";
import Ref, {RefArray} from "../wrapper/decorators/Ref";
import Populate from "../wrapper/decorators/Populate";
import SchemaOption from "../wrapper/decorators/SchemaOption";
import User from "./User.model";

@Collection
@SchemaOption("timestamps", true)
export default class Order extends DBDocument {
    constructor(code: string, user: User, products: Product[], quantities: number[]) {
        super();
        this.code = code
        this.products = products
        this.user = user
        this.quantities = quantities
    }

    public _id?: ObjectId
    public __v?: number

    @Field
    @Required
    @Unique
    public code: string

    @Default([])
    @Populate
    @RefArray(Product)
    public products: Product[]

    @FieldArray(Number)
    public quantities: number[]

    @Ref
    @Populate
    public user: User
}
