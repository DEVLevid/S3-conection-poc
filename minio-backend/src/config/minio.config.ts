import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => ({
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  accessKey: process.env.MINIO_ACCESS_KEY || 'MINIO_ADMIN',
  secretKey: process.env.MINIO_SECRET_KEY || 'MINIO_PASSWORD',
  bucketName: process.env.MINIO_BUCKET_NAME || 'poc-bucket',
  useSSL: process.env.MINIO_USE_SSL === 'true',
}));
