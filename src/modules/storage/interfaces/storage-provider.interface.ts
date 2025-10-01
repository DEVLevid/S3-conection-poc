export interface IStorageProvider {
  uploadFile(file: Express.Multer.File, fileName: string): Promise<{
    fileName: string;
    url: string;
  }>;
  deleteFile(fileName: string): Promise<void>;
  getFileUrl(fileName: string, expiresIn?: number): Promise<string>;
  listFiles(): Promise<any[]>;
}

export const STORAGE_PROVIDER_TOKEN = Symbol('IStorageProvider');