import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import type { StorageProvider } from "./types";

function getGCSBucket() {
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
      client_email: process.env.GCS_CLIENT_EMAIL,
      private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
  });
  return storage.bucket(process.env.GCS_BUCKET_NAME!);
}

export const gcsProvider: StorageProvider = {
  async upload(buffer, originalName, mimeType, folder = "media") {
    const ext = originalName.split(".").pop()?.toLowerCase() ?? "jpg";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `${folder}/${timestamp}-${randomSuffix}.${ext}`;

    let processedBuffer = buffer;
    let width: number | undefined;
    let height: number | undefined;
    let size = buffer.byteLength;

    if (mimeType.startsWith("image/") && mimeType !== "image/gif") {
      const sharpInstance = sharp(buffer);
      const meta = await sharpInstance.metadata();
      width = meta.width;
      height = meta.height;

      processedBuffer = await sharpInstance
        .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
      size = processedBuffer.byteLength;
    }

    const bucket = getGCSBucket();
    const file = bucket.file(filename);
    await file.save(processedBuffer, {
      metadata: { contentType: mimeType },
      public: true,
    });

    const url = `${process.env.NEXT_PUBLIC_GCS_BUCKET_URL}/${filename}`;
    return {
      url,
      gcsPath: filename,
      filename: `${timestamp}-${randomSuffix}.${ext}`,
      size,
      mimeType,
      width,
      height,
    };
  },

  async delete(gcsPath) {
    try {
      await getGCSBucket().file(gcsPath).delete();
    } catch {
      // File may not exist
    }
  },

  getPublicUrl(gcsPath) {
    return `${process.env.NEXT_PUBLIC_GCS_BUCKET_URL}/${gcsPath}`;
  },
};
