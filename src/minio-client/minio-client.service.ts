import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioClientService implements OnModuleInit {
  private readonly logger = new Logger(MinioClientService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const minioConfig = this.configService.get('minio');
    
    this.minioClient = new Minio.Client({
      endPoint: minioConfig.endpoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
    
    this.bucketName = minioConfig.bucketName;
  }

  async onModuleInit() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        this.logger.log(`Bucket "${this.bucketName}" não encontrado. Criando...`);
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket "${this.bucketName}" criado com sucesso.`);
      }
    } catch (error) {
      this.logger.error('Erro ao verificar/criar o bucket:', error);
    }
  }

  public getClient(): Minio.Client {
    return this.minioClient;
  }

  public getBucketName(): string {
    return this.bucketName;
  }
}
