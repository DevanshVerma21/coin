import mongoose, { Schema, Document, Model } from "mongoose";
import type { IMediaAsset } from "@/types";

export interface IMediaAssetDocument extends Omit<IMediaAsset, "_id">, Document {}

const mediaAssetSchema = new Schema<IMediaAssetDocument>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    gcsPath: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: String, required: true },
    tags: [{ type: String, lowercase: true, trim: true }],
  },
  { timestamps: true }
);

mediaAssetSchema.index({ tags: 1 });
mediaAssetSchema.index({ createdAt: -1 });

const MediaAsset: Model<IMediaAssetDocument> =
  mongoose.models.MediaAsset ??
  mongoose.model<IMediaAssetDocument>("MediaAsset", mediaAssetSchema);

export default MediaAsset;
