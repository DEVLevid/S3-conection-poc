import type { ApiResponse, PaginatedResponse } from '../interfaces';

export class ResponseUtils {
  /**
   * Creates a successful API response
   */
  static success<T>(
    data: T,
    message = 'Operation successful',
    path = '',
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  /**
   * Creates an error API response
   */
  static error(
    message: string,
    error?: string,
    path = '',
  ): ApiResponse {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  /**
   * Creates a paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Data retrieved successfully',
    path = '',
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      timestamp: new Date().toISOString(),
      path,
    };
  }
}
