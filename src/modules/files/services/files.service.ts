import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { IStorageProvider } from '../../storage/interfaces';
import { STORAGE_PROVIDER_TOKEN } from '../../storage/interfaces';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly files: any[] = [];

  constructor(
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      this.logger.log(`Starting file upload: ${file.originalname}`);

      const fileName = `${uuidv4()}-${file.originalname}`;
      const uploadResult = await this.storageProvider.uploadFile(file, fileName);

      const fileData = {
        id: uuidv4(),
        fileName: uploadResult.fileName,
        originalName: file.originalname,
        size: file.size,
        url: uploadResult.url,
        uploadDate: new Date(),
      };

      this.files.push(fileData);
      this.logger.log(`File uploaded successfully: ${fileData.id}`);
      
      return fileData;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${file.originalname}`, error);
      throw new Error('Failed to upload file');
    }
  }

  async listFiles() {
    return this.files;
  }
}