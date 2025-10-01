import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import type { MimeType } from '../types';

const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, 
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'] as MimeType[]
};

export class FileUtils {
  static generateUniqueFileName(originalName: string): string {
    const extension = extname(originalName);
    const uuid = uuidv4();
    const baseName = originalName.replace(extension, '').replace(/[^a-zA-Z0-9]/g, '_');
    return `${uuid}-${baseName}${extension}`;
  }

  static validateFileSize(size: number): boolean {
    return size <= FILE_CONSTANTS.MAX_FILE_SIZE;
  }

  static validateMimeType(mimeType: string): boolean {
    return FILE_CONSTANTS.ALLOWED_MIME_TYPES.includes(mimeType as MimeType);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileExtension(filename: string): string {
    return extname(filename).toLowerCase();
  }

  static sanitizeFileName(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
}
