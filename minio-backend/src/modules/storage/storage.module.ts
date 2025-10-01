import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioStorageProvider } from './providers';
import { STORAGE_PROVIDER_TOKEN } from './interfaces';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_PROVIDER_TOKEN,
      useClass: MinioStorageProvider,
    },
  ],
  exports: [STORAGE_PROVIDER_TOKEN],
})
export class StorageModule {}
