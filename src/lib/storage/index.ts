import type { StorageProvider, UploadResult } from "./types";

export type { UploadResult };

function getProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "cloudinary";

  if (provider === "gcs") {
    // Dynamic import so GCS SDK is only loaded when selected
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { gcsProvider } = require("./gcs") as { gcsProvider: StorageProvider };
    return gcsProvider;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cloudinaryProvider } = require("./cloudinary") as { cloudinaryProvider: StorageProvider };
  return cloudinaryProvider;
}

export async function uploadImageToStorage(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder?: string
): Promise<UploadResult> {
  return getProvider().upload(buffer, originalName, mimeType, folder);
}

export async function deleteFromStorage(path: string): Promise<void> {
  return getProvider().delete(path);
}

export function getPublicUrl(path: string): string {
  return getProvider().getPublicUrl(path);
}
