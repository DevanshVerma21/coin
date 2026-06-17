export interface UploadResult {
  url: string;
  gcsPath: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface StorageProvider {
  upload(buffer: Buffer, originalName: string, mimeType: string, folder?: string): Promise<UploadResult>;
  delete(gcsPath: string): Promise<void>;
  getPublicUrl(gcsPath: string): string;
}
