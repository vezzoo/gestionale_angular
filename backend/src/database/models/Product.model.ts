import {model, Model, ObjectId, Schema, Document} from "mongoose";
import Collection from "../wrapper/decorators/Collection";
import DBDocument from "../wrapper/DBDocument";
import Field from "../wrapper/decorators/Field";
import Required from "../wrapper/decorators/Required";
import Default from "../wrapper/decorators/Default";
import Unique from "../wrapper/decorators/Unique";

@Collection
export default class Product extends DBDocument {
    constructor(title: string, price: number, category: string, stock?: number, description?: string) {
        super();
        this.title = title;
        this.price = price;
        this.category = category;
        this.stock = 0
        if(stock)
            this.stock = stock;
        if(description)
            this.description = description;
    }

    public _id?: ObjectId
    public __v?: number

    @Field
    @Required
    @Unique
    public title: string

    @Field
    @Required
    public price: number

    @Field
    @Required
    public category: string

    @Field
    @Default(0)
    public stock: number

    @Field
    public description?: string
}
