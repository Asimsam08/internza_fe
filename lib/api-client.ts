const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1'

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

interface ApiErrorResponse {
  statusCode: number
  message: string
  timestamp: string
  path: string
}

// Custom error class to preserve API error details
export class ApiError extends Error {
  statusCode?: number
  timestamp?: string
  path?: string
  method?: string

  constructor(message: string, statusCode?: number, timestamp?: string, path?: string, method?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.timestamp = timestamp
    this.path = path
    this.method = method
  }
}

// TransformInterceptor wraps responses in this structure
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  timestamp: string
}

// Add subscriber to wait for refresh
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

// Notify all subscribers that refresh is complete
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

// Refresh access token
async function refreshAccessToken(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => resolve(token))
    })
  }

  isRefreshing = true

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Important: include cookies
    })

    if (!response.ok) {
      throw new Error('Refresh failed')
    }

    const data = await response.json()
    isRefreshing = false
    onRefreshed('success') // Notify all waiting requests
    return 'success'
  } catch (error) {
    isRefreshing = false
    refreshSubscribers = []
    throw error
  }
}

// Main API client with automatic token refresh
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  // Include credentials for cookies
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  let response = await fetch(url, config)

  // If 401, try to refresh token (but not for auth endpoints to avoid session expired errors during login)
  const isAuthEndpoint = endpoint.includes('/auth/signin') ||
                         endpoint.includes('/auth/signup') ||
                         endpoint.includes('/auth/refresh')
  // Note: /auth/me is NOT excluded - it should trigger token refresh on page reload
  
  if (response.status === 401 && !isAuthEndpoint) {
    try {
      await refreshAccessToken()
      // Retry original request
      response = await fetch(url, config)
    } catch (refreshError) {
      // Refresh failed, throw error for calling code to handle
      throw new Error('Session expired')
    }
  }

  if (!response.ok) {
    try {
      const error: ApiErrorResponse = await response.json()
      console.error('API Error:', error)
      // Pass through the exact backend error message using custom error class
      throw new ApiError(
        error.message || `API request failed with status ${response.status}`,
        error.statusCode,
        error.timestamp,
        error.path,
        error.method
      )
    } catch (parseError) {
      // If error response is not JSON, throw generic error with status
      throw new ApiError(`API request failed with status ${response.status}`, response.status)
    }
  }

  try {
    const data = await response.json()
    console.log(`API Response [${endpoint}]:`, data)
    return data
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError)
    throw new Error('Invalid response from server')
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data: any) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: any) =>
    apiClient<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: any) =>
    apiClient<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),
}

/**
 * Extract error message from error object
 * Handles different error structures from API, React Query, etc.
 */
export function getErrorMessage(error: any): string {
  // If error has a message property, use it
  if (error?.message) {
    return error.message
  }

  // If error has a response with data.message (axios-like structure)
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  // If error has a response with data (NestJS structure)
  if (error?.response?.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data
    }
    if (error.response.data.message) {
      return error.response.data.message
    }
  }

  // Fallback to generic message
  return 'An unexpected error occurred'
}
