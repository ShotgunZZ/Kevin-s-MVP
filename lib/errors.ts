// Custom error classes for better error handling

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed', code?: string) {
    super(message, 401, code)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', code?: string) {
    super(message, 500, code)
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', code?: string) {
    super(message, 400, code)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code?: string) {
    super(message, 404, code)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden', code?: string) {
    super(message, 403, code)
  }
}

// Error formatting utilities
export function formatError(error: unknown): {
  message: string
  statusCode: number
  code?: string
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    }
  }

  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
  }
}

// Error logging function
export function logError(error: unknown, context?: Record<string, any>) {
  const formattedError = formatError(error)

  console.error('[Error]', {
    ...formattedError,
    context,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  })

  // In production, you would send this to an error tracking service like Sentry
  // Example: Sentry.captureException(error, { extra: context })
}

// User-friendly error messages
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AuthError) {
    return 'Please sign in to continue.'
  }

  if (error instanceof ValidationError) {
    return error.message
  }

  if (error instanceof NotFoundError) {
    return 'The requested resource was not found.'
  }

  if (error instanceof ForbiddenError) {
    return 'You do not have permission to access this resource.'
  }

  if (error instanceof DatabaseError) {
    return 'A database error occurred. Please try again later.'
  }

  return 'An unexpected error occurred. Please try again.'
}
