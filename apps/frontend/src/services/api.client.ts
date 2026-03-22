// API Client Configuration for GrievanceGrid
// This file provides the base configuration for all API calls
// Currently uses mock mode - set USE_MOCK_API to false when backend is ready

// =============================================================================
// CONFIGURATION
// =============================================================================

const USE_MOCK_API = true; // Set to true to use mock data instead of real backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const API_TIMEOUT = 30000; // 30 seconds

// =============================================================================
// TYPES
// =============================================================================

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

// =============================================================================
// LOGGING UTILITIES
// =============================================================================

const logApiCall = (
  method: string,
  endpoint: string,
  params?: any,
  responseData?: any,
  duration?: number
) => {
  const timestamp = new Date().toISOString();
  const durationStr = duration ? ` (${duration}ms)` : "";
  
  console.group(`🌐 [API] ${method} ${endpoint}${durationStr}`);
  console.log("⏰ Timestamp:", timestamp);
  
  if (params) {
    console.log("📤 Request:", params);
  }
  
  if (responseData) {
    console.log("📥 Response:", responseData);
  }
  
  console.groupEnd();
};

const logApiError = (
  method: string,
  endpoint: string,
  error: any,
  duration?: number
) => {
  const timestamp = new Date().toISOString();
  const durationStr = duration ? ` (${duration}ms)` : "";
  
  console.group(`❌ [API ERROR] ${method} ${endpoint}${durationStr}`);
  console.log("⏰ Timestamp:", timestamp);
  console.error("💥 Error:", error);
  console.groupEnd();
};

// =============================================================================
// MOCK RESPONSE HANDLER
// =============================================================================

export const mockDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// =============================================================================
// API CLIENT
// =============================================================================

interface ApiClient {
  request: <T>(
    endpoint: string,
    options?: ApiRequestOptions,
    mockHandler?: () => Promise<T>
  ) => Promise<T>;
  get: <T>(endpoint: string, mockHandler?: () => Promise<T>) => Promise<T>;
  post: <T>(endpoint: string, body: any, mockHandler?: () => Promise<T>) => Promise<T>;
  put: <T>(endpoint: string, body: any, mockHandler?: () => Promise<T>) => Promise<T>;
  patch: <T>(endpoint: string, body: any, mockHandler?: () => Promise<T>) => Promise<T>;
  delete: <T>(endpoint: string, mockHandler?: () => Promise<T>) => Promise<T>;
}

export const apiClient: ApiClient = {
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    mockHandler?: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    const method = options.method || "GET";
    const fullUrl = `${API_BASE_URL}${endpoint}`;

    // Mock mode - use mock handler
    if (USE_MOCK_API && mockHandler) {
      logApiCall(method, endpoint, options.body);
      await mockDelay(options.timeout || 300);
      const data = await mockHandler();
      const duration = Date.now() - startTime;
      logApiCall(method, endpoint, options.body, data, duration);
      return data;
    }

    // Real API mode
    if (!USE_MOCK_API) {
      try {
        logApiCall(method, endpoint, options.body);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const isFormData = options.body instanceof FormData;

        const fetchOptions: RequestInit = {
          method,
          headers: {
            ...(!isFormData && { "Content-Type": "application/json" }),
            ...options.headers,
          },
          signal: controller.signal,
        };

        // Add auth token if available
        const token = localStorage.getItem("auth_token");
        if (token) {
          fetchOptions.headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        if (options.body && method !== "GET") {
          fetchOptions.body = isFormData ? options.body : JSON.stringify(options.body);
        }


        const response = await fetch(fullUrl, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(error.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;
        logApiCall(method, endpoint, options.body, data, duration);

        return data;
      } catch (error: any) {
        const duration = Date.now() - startTime;
        logApiError(method, endpoint, error, duration);
        throw error;
      }
    }

    // No mock handler provided and not in real mode
    throw new Error(`No mock handler for ${method} ${endpoint}`);
  },

  // Convenience methods
  get<T>(endpoint: string, mockHandler?: () => Promise<T>): Promise<T> {
    return apiClient.request<T>(endpoint, { method: "GET" }, mockHandler);
  },

  post<T>(endpoint: string, body: any, mockHandler?: () => Promise<T>): Promise<T> {
    return apiClient.request<T>(endpoint, { method: "POST", body }, mockHandler);
  },

  put<T>(endpoint: string, body: any, mockHandler?: () => Promise<T>): Promise<T> {
    return apiClient.request<T>(endpoint, { method: "PUT", body }, mockHandler);
  },

  patch<T>(endpoint: string, body: any, mockHandler?: () => Promise<T>): Promise<T> {
    return apiClient.request<T>(endpoint, { method: "PATCH", body }, mockHandler);
  },

  delete<T>(endpoint: string, mockHandler?: () => Promise<T>): Promise<T> {
    return apiClient.request<T>(endpoint, { method: "DELETE" }, mockHandler);
  },
};

// =============================================================================
// EXPORTS
// =============================================================================

export { API_BASE_URL, USE_MOCK_API };

// Health check helper
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};
