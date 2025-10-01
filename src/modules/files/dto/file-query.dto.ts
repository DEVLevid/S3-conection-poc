import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import type { SortOrder } from '../../../shared/types';

export class FileQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for file names',
    example: 'profile',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'uploadedAt',
    enum: ['fileName', 'size', 'uploadedAt'],
    default: 'uploadedAt',
  })
  @IsOptional()
  @IsString()
  @IsIn(['fileName', 'size', 'uploadedAt'])
  sortBy?: string = 'uploadedAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: SortOrder = 'DESC';

  @ApiPropertyOptional({
    description: 'Filter by mime type',
    example: 'image/jpeg',
  })
  @IsOptional()
  @IsString()
  mimeType?: string;
}
