import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BufferedFile } from './file.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly minioClientService: MinioClientService) {}

  async uploadFile(file: BufferedFile) {
    const client = this.minioClientService.getClient();
    const bucketName = this.minioClientService.getBucketName();

    const fileName = `${uuidv4()}-${file.originalname}`;

    try {
      await client.putObject(bucketName, fileName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });

      return {
        message: 'Arquivo enviado com sucesso!',
        fileName: fileName,
        url: `http://localhost:9000/${bucketName}/${fileName}`
      };
    } catch (error) {
      this.logger.error('Erro ao fazer upload do arquivo:', error);
      throw new InternalServerErrorException('Erro ao fazer upload do arquivo.');
    }
  }

  async listFiles() {
    const client = this.minioClientService.getClient();
    const bucketName = this.minioClientService.getBucketName();
    const files: any[] = [];
    const stream = client.listObjects(bucketName, '', true);

    return new Promise((resolve, reject) => {
        stream.on('data', (obj) => files.push(obj));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(files));
    });
  }
}
