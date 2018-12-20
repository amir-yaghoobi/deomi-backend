import { Schema, model, Document } from 'mongoose';

const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    pictures: {
      type: [String],
    },
  },
  { timestamps: true, autoIndex: true }
);

const Products = model<IProduct>('Products', productSchema);
export default Products;

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  inStock: number;
  category: string;
  pictures?: [string];
  createdAt: Date;
  updatedAt: Date;
}
