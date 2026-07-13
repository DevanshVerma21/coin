import mongoose, { Schema, Document, Model } from "mongoose";
import type { IItem, ItemType, RarityLevel } from "@/types";

export interface IItemDocument extends Omit<IItem, "_id" | "categories">, Document {
  categories: mongoose.Types.ObjectId[];
}

const provenanceSchema = new Schema(
  { period: { type: String, required: true }, description: { type: String, required: true } },
  { _id: false }
);

const itemSchema = new Schema<IItemDocument>(
  {
    itemNumber: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ["coin", "note"] as ItemType[], required: true },
    year: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    frontImage: { type: String, required: true },
    backImage: { type: String },
    additionalImages: [{ type: String }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    featured: { type: Boolean, default: false },
    featuredUntil: { type: Date },
    sold: { type: Boolean, default: false },
    views: { type: Number, default: 0, min: 0 },
    // Archival fields
    denomination: { type: String, trim: true },
    composition: { type: String, trim: true },
    weight: { type: String, trim: true },
    mint: { type: String, trim: true },
    diameter: { type: String, trim: true },
    rarity: { type: String, enum: ["R", "RR", "RRR", "RRRR"] as RarityLevel[] },
    grade: { type: String, trim: true },
    gradeType: { type: String, trim: true },
    historicalContext: { type: String },
    provenance: [provenanceSchema],
  },
  { timestamps: true }
);

itemSchema.index({ type: 1 });
itemSchema.index({ type: 1, createdAt: -1 }); // primary catalog sort query
itemSchema.index({ featured: 1, featuredUntil: 1 });
itemSchema.index({ sold: 1 });
itemSchema.index({ year: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ categories: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index(
  { title: "text", description: "text", year: "text", itemNumber: "text" },
  { weights: { title: 10, itemNumber: 8, year: 5, description: 1 } }
);

const Item: Model<IItemDocument> =
  mongoose.models.Item ?? mongoose.model<IItemDocument>("Item", itemSchema);

export default Item;
