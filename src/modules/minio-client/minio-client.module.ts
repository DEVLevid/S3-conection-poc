import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
