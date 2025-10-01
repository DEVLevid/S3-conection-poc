export interface StorageFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface StorageProvider {
  uploadFile(file: StorageFile, fileName?: string): Promise<UploadResult>;
  deleteFile(fileName: string): Promise<void>;
  getFileUrl(fileName: string, expiresIn?: number): Promise<string>;
  listFiles(prefix?: string): Promise<FileInfo[]>;
  fileExists(fileName: string): Promise<boolean>;
}

export interface UploadResult {
  fileName: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface FileInfo {
  name: string;
  size: number;
  lastModified: Date;
  etag: string;
}
