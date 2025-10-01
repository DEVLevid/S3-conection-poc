import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from '../services';
import { FileEntity } from '../entities';
import { FileQueryDto } from '../dto';
import { FileNotFoundException } from '../../../common/exceptions';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: jest.Mocked<FilesService>;

  const mockFilesService = {
    uploadFile: jest.fn(),
    getFile: jest.fn(),
    getFiles: jest.fn(),
    deleteFile: jest.fn(),
    getFileUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get(FilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const mockFileEntity = new FileEntity({
      id: 'test-id',
      fileName: 'uuid-test.jpg',
      originalName: 'test.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    it('should upload file successfully', async () => {
      const mockUrl = 'https://example.com/uuid-test.jpg';
      
      filesService.uploadFile.mockResolvedValue(mockFileEntity);
      filesService.getFileUrl.mockResolvedValue(mockUrl);

      const result = await controller.uploadFile(mockFile, 'Test description', 'tag1,tag2');

      expect(result).toBeDefined();
      expect(result.message).toBe('File uploaded successfully');
      expect(result.file.id).toBe(mockFileEntity.id);
      expect(result.file.url).toBe(mockUrl);
      expect(filesService.uploadFile).toHaveBeenCalledWith(mockFile, {
        description: 'Test description',
        tags: ['tag1', 'tag2'],
      });
    });

    it('should upload file without optional parameters', async () => {
      const mockUrl = 'https://example.com/uuid-test.jpg';
      
      filesService.uploadFile.mockResolvedValue(mockFileEntity);
      filesService.getFileUrl.mockResolvedValue(mockUrl);

      const result = await controller.uploadFile(mockFile);

      expect(result).toBeDefined();
      expect(filesService.uploadFile).toHaveBeenCalledWith(mockFile, {
        description: undefined,
        tags: undefined,
      });
    });
  });

  describe('getFiles', () => {
    it('should return paginated files', async () => {
      const query: FileQueryDto = { page: 1, limit: 10 };
      const mockFiles = [
        new FileEntity({
          id: 'test-id-1',
          fileName: 'uuid-test1.jpg',
          originalName: 'test1.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          uploadedAt: new Date(),
          updatedAt: new Date(),
        }),
      ];
      const mockUrl = 'https://example.com/uuid-test1.jpg';

      filesService.getFiles.mockResolvedValue({ files: mockFiles, total: 1 });
      filesService.getFileUrl.mockResolvedValue(mockUrl);

      const result = await controller.getFiles(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.pagination?.total).toBe(1);
      expect(filesService.getFiles).toHaveBeenCalledWith(query);
    });
  });

  describe('getFile', () => {
    const mockFileEntity = new FileEntity({
      id: 'test-id',
      fileName: 'uuid-test.jpg',
      originalName: 'test.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    it('should return file when found', async () => {
      const mockUrl = 'https://example.com/uuid-test.jpg';
      
      filesService.getFile.mockResolvedValue(mockFileEntity);
      filesService.getFileUrl.mockResolvedValue(mockUrl);

      const result = await controller.getFile('test-id');

      expect(result).toBeDefined();
      expect(result.id).toBe(mockFileEntity.id);
      expect(result.url).toBe(mockUrl);
      expect(filesService.getFile).toHaveBeenCalledWith('test-id');
    });

    it('should throw FileNotFoundException when file not found', async () => {
      filesService.getFile.mockResolvedValue(null);

      await expect(controller.getFile('non-existent-id')).rejects.toThrow(FileNotFoundException);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      filesService.deleteFile.mockResolvedValue();

      const result = await controller.deleteFile('test-id');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('File deleted successfully');
      expect(filesService.deleteFile).toHaveBeenCalledWith('test-id');
    });
  });
});
