import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import sharp from "sharp";
import type { StorageProvider } from "./types";

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export const cloudinaryProvider: StorageProvider = {
  async upload(buffer, originalName, mimeType, folder = "ntik-media") {
    const ext = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
    let processedBuffer = buffer;
    let width: number | undefined;
    let height: number | undefined;

    if (mimeType.startsWith("image/") && mimeType !== "image/gif") {
      const sharpInstance = sharp(buffer);
      const meta = await sharpInstance.metadata();
      width = meta.width;
      height = meta.height;

      processedBuffer = await sharpInstance
        .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      getCloudinary().uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            format: ext === "gif" ? "gif" : "jpg",
          },
          (err, res) => {
            if (err || !res) reject(err ?? new Error("Upload failed"));
            else resolve(res);
          }
        )
        .end(processedBuffer);
    });

    return {
      url: result.secure_url,
      gcsPath: result.public_id,
      filename: result.public_id.split("/").pop() ?? result.public_id,
      size: result.bytes,
      mimeType,
      width: result.width ?? width,
      height: result.height ?? height,
    };
  },

  async delete(publicId) {
    try {
      await getCloudinary().uploader.destroy(publicId);
    } catch {
      // Asset may not exist
    }
  },

  getPublicUrl(publicId) {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
  },
};
