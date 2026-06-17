import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPasswordResetDocument extends Document {
  email: string;
  token: string;        // cryptographically random 64-char hex
  expires: Date;
  used: boolean;
  createdAt: Date;
}

const passwordResetSchema = new Schema<IPasswordResetDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-delete documents after they expire (MongoDB TTL index)
passwordResetSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });
passwordResetSchema.index({ email: 1 });

const PasswordReset: Model<IPasswordResetDocument> =
  mongoose.models.PasswordReset ??
  mongoose.model<IPasswordResetDocument>("PasswordReset", passwordResetSchema);

export default PasswordReset;
