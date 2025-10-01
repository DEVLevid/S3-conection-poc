import { registerAs } from '@nestjs/config';

export interface StorageConfig {
  endpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  region: string;
}

export default registerAs('storage', (): StorageConfig => ({
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucketName: process.env.MINIO_BUCKET_NAME || 'uploads',
  region: process.env.MINIO_REGION || 'us-east-1',
}));
