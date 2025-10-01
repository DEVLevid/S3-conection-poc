export type Environment = 'development' | 'production' | 'test';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

export type SortOrder = 'ASC' | 'DESC';

export type FileStatus = 'uploading' | 'uploaded' | 'failed' | 'deleted';

export type MimeType = 
  | 'image/jpeg'
  | 'image/png' 
  | 'image/gif'
  | 'image/webp'
  | 'application/pdf'
  | 'text/plain'
  | 'application/json';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
