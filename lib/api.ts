import type { ProcessedGenome } from '@/types/torre';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchGenome(username: string): Promise<ProcessedGenome> {
  if (!username || username.trim().length === 0) {
    throw new ApiError('Username is required', 400, 'INVALID_USERNAME');
  }

  const sanitizedUsername = username.trim().toLowerCase();
  if (!/^[a-zA-Z0-9._-]+$/.test(sanitizedUsername)) {
    throw new ApiError('Invalid username format', 400, 'INVALID_FORMAT');
  }

  try {
    const response = await fetch(`${API_BASE}/genome/${sanitizedUsername}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 400:
          throw new ApiError(
            errorData.error || 'Invalid request',
            400,
            'BAD_REQUEST'
          );
        case 404:
          throw new ApiError(
            `Torre user "${username}" not found`,
            404,
            'USER_NOT_FOUND'
          );
        case 429:
          throw new ApiError(
            'Too many requests. Please try again later.',
            429,
            'RATE_LIMITED'
          );
        case 502:
          throw new ApiError(
            'Torre API is currently unavailable',
            502,
            'UPSTREAM_ERROR'
          );
        case 504:
          throw new ApiError(
            'Request timeout. Please try again.',
            504,
            'TIMEOUT'
          );
        default:
          throw new ApiError(
            'An unexpected error occurred',
            response.status,
            'UNKNOWN_ERROR'
          );
      }
    }

    const data: ProcessedGenome = await response.json();

    if (!data.person || !data.person.username || !Array.isArray(data.skills)) {
      throw new ApiError(
        'Invalid response format from server',
        500,
        'INVALID_RESPONSE'
      );
    }
    const hasValidSkills = data.skills.every(
      (skill) =>
        skill.name &&
        typeof skill.proficiency === 'number' &&
        typeof skill.percentile === 'number' &&
        skill.source
    );

    if (!hasValidSkills) {
      throw new ApiError(
        'Invalid skills data received',
        500,
        'INVALID_SKILLS'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error. Please check your connection.',
        0,
        'NETWORK_ERROR'
      );
    }

    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError(
        'Request timeout. Please try again.',
        504,
        'TIMEOUT'
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Unexpected error in fetchGenome:', error);
    throw new ApiError(
      'An unexpected error occurred',
      500,
      'UNEXPECTED_ERROR'
    );
  }
}

export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;

  if (error.status >= 400 && error.status < 500 && error.status !== 429) {
    return false;
  }

  return error.status >= 500 || error.status === 429 || error.status === 0;
}
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}