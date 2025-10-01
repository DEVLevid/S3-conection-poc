import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioClientService implements OnModuleInit {
  private readonly logger = new Logger(MinioClientService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: +(this.configService.get<number>('MINIO_PORT') || 9000),
      useSSL: false,
      accessKey:
        this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey:
        this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin',
    });
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') || 'uploads';
  }

  async onModuleInit() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        this.logger.log(
          `Bucket "${this.bucketName}" não encontrado. Criando...`,
        );
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
