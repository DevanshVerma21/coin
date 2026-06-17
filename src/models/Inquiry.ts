import mongoose, { Schema, Document, Model } from "mongoose";
import type { IInquiry } from "@/types";

export interface IInquiryDocument extends Omit<IInquiry, "_id">, Document {}

const inquirySchema = new Schema<IInquiryDocument>(
  {
    itemId: { type: String, required: true },
    itemTitle: { type: String, required: true },
    itemNumber: { type: String, required: true },
    userName: { type: String },
    userEmail: { type: String },
    message: { type: String },
    whatsappNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

inquirySchema.index({ itemId: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });

const Inquiry: Model<IInquiryDocument> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiryDocument>("Inquiry", inquirySchema);

export default Inquiry;
