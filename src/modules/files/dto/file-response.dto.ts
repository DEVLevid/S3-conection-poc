import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the file',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Generated filename in storage',
    example: '123e4567-e89b-12d3-a456-426614174000-profile_picture.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'Original filename from upload',
    example: 'profile picture.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: 'Formatted file size',
    example: '1.02 MB',
  })
  formattedSize: string;

  @ApiProperty({
    description: 'Presigned URL for file access',
    example: 'https://minio.example.com/bucket/file.jpg?X-Amz-Expires=86400',
  })
  url: string;

  @ApiProperty({
    description: 'File description',
    example: 'Profile picture for user',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'File tags',
    example: ['profile', 'image', 'user'],
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: 'Upload timestamp',
    example: '2023-12-01T10:30:00.000Z',
  })
  uploadedAt: string;
}

export class FileUploadResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'File uploaded successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Uploaded file information',
    type: FileResponseDto,
  })
  file: FileResponseDto;
}
