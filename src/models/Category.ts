import mongoose, { Schema, Document, Model } from "mongoose";
import type { ICategory, ItemType } from "@/types";

export interface ICategoryDocument extends Omit<ICategory, "_id">, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ["coin", "note"] as ItemType[], required: true },
    description: { type: String, trim: true },
    itemCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ type: 1 });

const Category: Model<ICategoryDocument> =
  mongoose.models.Category ?? mongoose.model<ICategoryDocument>("Category", categorySchema);

export default Category;
