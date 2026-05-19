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

    await response.json()
    isRefreshing = false
    onRefreshed('success') // Notify all waiting requests
    return 'success'
  } catch (error) {
    isRefreshing = false
    refreshSubscribers = []
    throw error
  }
}

function isAuthEndpoint(endpoint: string): boolean {
  return (
    endpoint.includes('/auth/signin') ||
    endpoint.includes('/auth/signup') ||
    endpoint.includes('/auth/refresh')
  )
}

async function parseErrorResponse(response: Response): Promise<never> {
  try {
    const error: ApiErrorResponse = await response.json()
    console.error('API Error:', error)
    throw new ApiError(
      error.message || `API request failed with status ${response.status}`,
      error.statusCode,
      error.timestamp,
      error.path,
    )
  } catch (e) {
    if (e instanceof ApiError) throw e
    throw new ApiError(`API request failed with status ${response.status}`, response.status)
  }
}

/** Authenticated fetch with cookie session + automatic refresh on 401 */
async function fetchWithAuth(url: string, options: RequestInit, endpoint: string): Promise<Response> {
  const config: RequestInit = {
    ...options,
    credentials: 'include',
  }

  let response = await fetch(url, config)

  if (response.status === 401 && !isAuthEndpoint(endpoint)) {
    try {
      await refreshAccessToken()
      response = await fetch(url, config)
    } catch {
      throw new ApiError('Session expired. Please sign in again.', 401)
    }
  }

  return response
}

// Main API client with automatic token refresh
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetchWithAuth(
    url,
    { ...options, headers },
    endpoint,
  )

  if (!response.ok) {
    await parseErrorResponse(response)
  }

  try {
    const data = await response.json()
    console.log(`API Response [${endpoint}]:`, data)
    return data
  } catch {
    throw new Error('Invalid response from server')
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data: unknown) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) =>
    apiClient<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: <T>(endpoint: string, data: unknown) =>
    apiClient<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),
}

export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST',
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  // Do not set Content-Type — browser sets multipart boundary with cookies
  const response = await fetchWithAuth(url, { method, body: formData }, endpoint)

  if (!response.ok) {
    await parseErrorResponse(response)
  }

  return response.json()
}

/**
 * Extract error message from error object
 * Handles different error structures from API, React Query, etc.
 */
export function unwrapApiData<T>(response: unknown): T {
  if (response !== null && typeof response === "object" && "data" in response) {
    return (response as { data: T }).data
  }
  return response as T
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === "string") return message
  }

  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: unknown } }).response?.data
    if (typeof data === "string") return data
    if (data && typeof data === "object" && "message" in data) {
      const nested = (data as { message: unknown }).message
      if (typeof nested === "string") return nested
    }
  }

  return "An unexpected error occurred"
}
