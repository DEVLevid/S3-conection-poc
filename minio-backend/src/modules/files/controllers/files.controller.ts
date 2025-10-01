import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../services';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const result = await this.filesService.uploadFile(file);
    return {
      message: 'File uploaded successfully!',
      fileName: result.fileName,
      url: result.url
    };
  }

  @Get()
  async getFiles() {
    const result = await this.filesService.listFiles();
    return result;
  }
}
