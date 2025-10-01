import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MinioStorageProvider } from './minio-storage.provider';
import { StorageException } from '../../../common/exceptions';
import type { StorageFile } from '../../../shared/interfaces';

const mockMinioClient = {
  putObject: jest.fn(),
  removeObject: jest.fn(),
  presignedGetObject: jest.fn(),
  listObjects: jest.fn(),
  statObject: jest.fn(),
  makeBucket: jest.fn(),
  bucketExists: jest.fn(),
};

jest.mock('minio', () => ({
  Client: jest.fn().mockImplementation(() => mockMinioClient),
}));

describe('MinioStorageProvider', () => {
  let provider: MinioStorageProvider;
  let configService: jest.Mocked<ConfigService>;

  const mockStorageConfig = {
    endpoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    bucketName: 'test-bucket',
    region: 'us-east-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioStorageProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockStorageConfig),
          },
        },
      ],
    }).compile();

    provider = module.get<MinioStorageProvider>(MinioStorageProvider);
    configService = module.get(ConfigService);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should initialize successfully when bucket exists', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(true);

      await provider.onModuleInit();

      expect(mockMinioClient.bucketExists).toHaveBeenCalledWith('test-bucket');
      expect(mockMinioClient.makeBucket).not.toHaveBeenCalled();
    });

    it('should create bucket when it does not exist', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(false);
      mockMinioClient.makeBucket.mockResolvedValue(undefined);

      await provider.onModuleInit();

      expect(mockMinioClient.bucketExists).toHaveBeenCalledWith('test-bucket');
      expect(mockMinioClient.makeBucket).toHaveBeenCalledWith('test-bucket', 'us-east-1');
    });

    it('should throw StorageException on initialization error', async () => {
      const error = new Error('Connection failed');
      mockMinioClient.bucketExists.mockRejectedValue(error);

      await expect(provider.onModuleInit()).rejects.toThrow(StorageException);
    });
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

    it('should upload file successfully', async () => {
      const mockUrl = 'https://example.com/test.jpg';
      
      mockMinioClient.putObject.mockResolvedValue(undefined);
      mockMinioClient.presignedGetObject.mockResolvedValue(mockUrl);

      const result = await provider.uploadFile(mockFile, 'custom-name.jpg');

      expect(result).toBeDefined();
      expect(result.fileName).toBe('custom-name.jpg');
      expect(result.url).toBe(mockUrl);
      expect(result.size).toBe(1024);
      expect(result.mimeType).toBe('image/jpeg');
      
      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'test-bucket',
        'custom-name.jpg',
        mockFile.buffer,
        mockFile.size,
        {
          'Content-Type': 'image/jpeg',
          'Original-Name': 'test.jpg',
        },
      );
    });

    it('should generate filename when not provided', async () => {
      const mockUrl = 'https://example.com/test.jpg';
      
      mockMinioClient.putObject.mockResolvedValue(undefined);
      mockMinioClient.presignedGetObject.mockResolvedValue(mockUrl);

      const result = await provider.uploadFile(mockFile);

      expect(result.fileName).toMatch(/.*-test\.jpg$/);
      expect(mockMinioClient.putObject).toHaveBeenCalled();
    });

    it('should throw StorageException on upload error', async () => {
      const error = new Error('Upload failed');
      mockMinioClient.putObject.mockRejectedValue(error);

      await expect(provider.uploadFile(mockFile)).rejects.toThrow(StorageException);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      mockMinioClient.removeObject.mockResolvedValue(undefined);

      await provider.deleteFile('test.jpg');

      expect(mockMinioClient.removeObject).toHaveBeenCalledWith('test-bucket', 'test.jpg');
    });

    it('should throw StorageException on delete error', async () => {
      const error = new Error('Delete failed');
      mockMinioClient.removeObject.mockRejectedValue(error);

      await expect(provider.deleteFile('test.jpg')).rejects.toThrow(StorageException);
    });
  });

  describe('getFileUrl', () => {
    it('should return presigned URL', async () => {
      const mockUrl = 'https://example.com/test.jpg';
      mockMinioClient.presignedGetObject.mockResolvedValue(mockUrl);

      const result = await provider.getFileUrl('test.jpg', 3600);

      expect(result).toBe(mockUrl);
      expect(mockMinioClient.presignedGetObject).toHaveBeenCalledWith('test-bucket', 'test.jpg', 3600);
    });

    it('should use default expiration when not provided', async () => {
      const mockUrl = 'https://example.com/test.jpg';
      mockMinioClient.presignedGetObject.mockResolvedValue(mockUrl);

      await provider.getFileUrl('test.jpg');

      expect(mockMinioClient.presignedGetObject).toHaveBeenCalledWith('test-bucket', 'test.jpg', 24 * 60 * 60);
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      mockMinioClient.statObject.mockResolvedValue({});

      const result = await provider.fileExists('test.jpg');

      expect(result).toBe(true);
      expect(mockMinioClient.statObject).toHaveBeenCalledWith('test-bucket', 'test.jpg');
    });

    it('should return false when file does not exist', async () => {
      const error = new Error('Not found');
      (error as any).code = 'NotFound';
      mockMinioClient.statObject.mockRejectedValue(error);

      const result = await provider.fileExists('test.jpg');

      expect(result).toBe(false);
    });

    it('should throw StorageException on other errors', async () => {
      const error = new Error('Connection failed');
      mockMinioClient.statObject.mockRejectedValue(error);

      await expect(provider.fileExists('test.jpg')).rejects.toThrow(StorageException);
    });
  });
});
