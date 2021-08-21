import {model, Model, ObjectId, Schema, Document} from "mongoose";

export interface IProduct {
    title: string;
    price: number;
    stock: number;
    description: string | undefined;
    category: string
}

const ProductSchema = new Schema({
    title: {type: String, required: true, unique: true},
    price: {type: String, required: true},
    category: {type: String, required: true},
    stock: {type: String, default: 0},
    description: {type: String, required: false}
})

export interface IProductDocument extends IProduct, Document<any, any, IProductModel> {
}

export interface IProductModel extends Model<IProductDocument> {
}

export default model<IProductModel>("product", ProductSchema)
