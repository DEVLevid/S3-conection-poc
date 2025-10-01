import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { STORAGE_PROVIDER_TOKEN } from '../../storage/interfaces';
import type { IStorageProvider } from '../../storage/interfaces';
import type { StorageFile, UploadResult } from '../../../shared/interfaces';
import { FileUploadException, FileNotFoundException } from '../../../common/exceptions';

describe('FilesService', () => {
  let service: FilesService;
  let storageProvider: jest.Mocked<IStorageProvider>;

  const mockStorageProvider: jest.Mocked<IStorageProvider> = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
    getFileUrl: jest.fn(),
    listFiles: jest.fn(),
    fileExists: jest.fn(),
    createBucket: jest.fn(),
    bucketExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: STORAGE_PROVIDER_TOKEN,
          useValue: mockStorageProvider,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    storageProvider = module.get(STORAGE_PROVIDER_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    const mockFile: StorageFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test'),
    };

    const mockUploadResult: UploadResult = {
      fileName: 'uuid-test.jpg',
      url: 'https://example.com/uuid-test.jpg',
      size: 1024,
      mimeType: 'image/jpeg',
    };

    it('should upload file successfully', async () => {
      storageProvider.uploadFile.mockResolvedValue(mockUploadResult);

      const result = await service.uploadFile(mockFile, {
        description: 'Test file',
        tags: ['test'],
      });

      expect(result).toBeDefined();
      expect(result.originalName).toBe(mockFile.originalname);
      expect(result.mimeType).toBe(mockFile.mimetype);
      expect(result.size).toBe(mockFile.size);
      expect(result.description).toBe('Test file');
      expect(result.tags).toEqual(['test']);
      expect(storageProvider.uploadFile).toHaveBeenCalledWith(
        mockFile,
        expect.stringContaining('test.jpg'),
      );
    });

    it('should throw FileUploadException on storage error', async () => {
      const error = new Error('Storage error');
      storageProvider.uploadFile.mockRejectedValue(error);

      await expect(service.uploadFile(mockFile)).rejects.toThrow(FileUploadException);
      expect(storageProvider.uploadFile).toHaveBeenCalled();
    });
  });

  describe('getFile', () => {
    it('should return file when found', async () => {
      const mockFile: StorageFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      storageProvider.uploadFile.mockResolvedValue({
        fileName: 'uuid-test.jpg',
        url: 'https://example.com/uuid-test.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
      });

      // First upload a file
      const uploadedFile = await service.uploadFile(mockFile);
      
      // Then retrieve it
      const result = await service.getFile(uploadedFile.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(uploadedFile.id);
    });

    it('should return null when file not found', async () => {
      const result = await service.getFile('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getFiles', () => {
    it('should return paginated files', async () => {
      const query = { page: 1, limit: 10 };
      const result = await service.getFiles(query);

      expect(result).toBeDefined();
      expect(result.files).toBeInstanceOf(Array);
      expect(result.total).toBe(0); // Empty store initially
    });

    it('should filter files by search term', async () => {
      // Upload a test file first
      const mockFile: StorageFile = {
        fieldname: 'file',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      storageProvider.uploadFile.mockResolvedValue({
        fileName: 'uuid-profile.jpg',
        url: 'https://example.com/uuid-profile.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
      });

      await service.uploadFile(mockFile);

      const result = await service.getFiles({ search: 'profile' });
      expect(result.files.length).toBe(1);
      expect(result.files[0].originalName).toBe('profile.jpg');
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      // Upload a file first
      const mockFile: StorageFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test'),
      };

      storageProvider.uploadFile.mockResolvedValue({
        fileName: 'uuid-test.jpg',
        url: 'https://example.com/uuid-test.jpg',
        size: 1024,
        mimeType: 'image/jpeg',
      });

      const uploadedFile = await service.uploadFile(mockFile);
      
      storageProvider.deleteFile.mockResolvedValue();

      await service.deleteFile(uploadedFile.id);

      expect(storageProvider.deleteFile).toHaveBeenCalledWith(uploadedFile.fileName);
    });

    it('should throw FileNotFoundException for non-existent file', async () => {
      await expect(service.deleteFile('non-existent-id')).rejects.toThrow(FileNotFoundException);
    });
  });

  describe('getFileUrl', () => {
    it('should return file URL', async () => {
      const fileName = 'test.jpg';
      const expectedUrl = 'https://example.com/test.jpg';
      
      storageProvider.getFileUrl.mockResolvedValue(expectedUrl);

      const result = await service.getFileUrl(fileName);

      expect(result).toBe(expectedUrl);
      expect(storageProvider.getFileUrl).toHaveBeenCalledWith(fileName, undefined);
    });

    it('should return file URL with custom expiration', async () => {
      const fileName = 'test.jpg';
      const expiresIn = 3600;
      const expectedUrl = 'https://example.com/test.jpg';
      
      storageProvider.getFileUrl.mockResolvedValue(expectedUrl);

      const result = await service.getFileUrl(fileName, expiresIn);

      expect(result).toBe(expectedUrl);
      expect(storageProvider.getFileUrl).toHaveBeenCalledWith(fileName, expiresIn);
    });
  });
});
