import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import type { StorageConfig } from '../../../config';
import type { IStorageProvider } from '../interfaces';

@Injectable()
export class MinioStorageProvider implements IStorageProvider, OnModuleInit {
  private readonly logger = new Logger(MinioStorageProvider.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const storageConfig = this.configService.get<StorageConfig>('storage');
    
    if (!storageConfig) {
      throw new Error('Storage configuration is required');
    }

    this.minioClient = new Minio.Client({
      endPoint: storageConfig.endpoint,
      port: storageConfig.port,
      useSSL: storageConfig.useSSL,
      accessKey: storageConfig.accessKey,
      secretKey: storageConfig.secretKey,
    });

    this.bucketName = storageConfig.bucketName;
  }

  async onModuleInit(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket "${this.bucketName}" created successfully`);
      }
      this.logger.log(`MinIO storage provider initialized with bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.error('Failed to initialize MinIO storage provider', error);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File, fileName: string) {
    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        24 * 60 * 60,
      );

      this.logger.log(`File uploaded successfully: ${fileName}`);

      return {
        fileName,
        url,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${file.originalname}`, error);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${fileName}`, error);
      throw error;
    }
  }

  async getFileUrl(fileName: string, expiresIn = 24 * 60 * 60): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        expiresIn,
      );
    } catch (error) {
      this.logger.error(`Failed to generate file URL: ${fileName}`, error);
      throw error;
    }
  }

  async listFiles(): Promise<any[]> {
    try {
      const files: any[] = [];
      const stream = this.minioClient.listObjects(this.bucketName, '', true);

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          files.push({
            name: obj.name || '',
            size: obj.size || 0,
            lastModified: obj.lastModified || new Date(),
          });
        });

        stream.on('error', (error) => {
          this.logger.error('Failed to list files', error);
          reject(error);
        });

        stream.on('end', () => {
          resolve(files);
        });
      });
    } catch (error) {
      this.logger.error('Failed to list files', error);
      throw error;
    }
  }
}