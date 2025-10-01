import type { StorageFile, UploadResult, FileInfo } from '../../../shared/interfaces';
import type { FileEntity } from '../entities';
import type { FileQueryDto } from '../dto';

export interface IFileService {
  uploadFile(file: StorageFile, options?: UploadOptions): Promise<FileEntity>;
  getFile(id: string): Promise<FileEntity | null>;
  getFiles(query: FileQueryDto): Promise<{ files: FileEntity[]; total: number }>;
  deleteFile(id: string): Promise<void>;
  getFileUrl(fileName: string, expiresIn?: number): Promise<string>;
}

export interface UploadOptions {
  description?: string;
  tags?: string[];
  generateThumbnail?: boolean;
}

export interface FileRepository {
  save(file: FileEntity): Promise<FileEntity>;
  findById(id: string): Promise<FileEntity | null>;
  findMany(query: FileQueryDto): Promise<{ files: FileEntity[]; total: number }>;
  delete(id: string): Promise<void>;
  update(id: string, updates: Partial<FileEntity>): Promise<FileEntity>;
}
