import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import type { BufferedFile } from './file.model';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    return this.filesService.uploadFile(file);
  }

  @Get()
  async listFiles() {
    return this.filesService.listFiles();
  }
}
