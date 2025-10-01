import { Module } from '@nestjs/common';
import { FilesController } from './controllers';
import { FilesService } from './services';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
