export class FileEntity {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  description?: string;
  tags?: string[];
  uploadedAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<FileEntity>) {
    Object.assign(this, partial);
  }

  get formattedSize(): string {
    if (this.size === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(this.size) / Math.log(k));
    
    return parseFloat((this.size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get fileExtension(): string {
    return this.fileName.split('.').pop()?.toLowerCase() || '';
  }

  get isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  get isPdf(): boolean {
    return this.mimeType === 'application/pdf';
  }

  get isText(): boolean {
    return this.mimeType.startsWith('text/');
  }
}
