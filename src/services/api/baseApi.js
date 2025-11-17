// src/services/api/baseApi.js - Base API Client

// Determine API URL based on environment
const getApiBaseUrl = () => {
  let apiUrl = null;

  // If env var is set, use it
  if (process.env.REACT_APP_API_URL) {
    apiUrl = process.env.REACT_APP_API_URL;
  }
  // Otherwise, detect based on hostname
  else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    apiUrl = 'http://localhost:8000/api/v1';
  }
  // Production fallback - always use HTTPS for deployed apps
  else {
    apiUrl = 'https://evolvefitaibackend-production.up.railway.app/api/v1';
  }

  // FORCE HTTPS if the URL starts with http:// and is not localhost
  if (apiUrl.startsWith('http://') && !apiUrl.includes('localhost') && !apiUrl.includes('127.0.0.1')) {
    console.warn('⚠️ Detected HTTP URL for production, forcing HTTPS:', apiUrl);
    apiUrl = apiUrl.replace('http://', 'https://');
  }

  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL for debugging
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔧 Hostname:', window.location.hostname);
console.log('🔧 Client Frontend API URL:', API_BASE_URL);
console.log('🔧 REACT_APP_API_URL env var:', process.env.REACT_APP_API_URL);

/**
 * Base API Client with common HTTP methods and error handling
 */
class BaseApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authorization headers
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generic request method with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: 'API request failed'
        }));

        const error = new Error(errorData.detail || `API request failed: ${response.status}`);
        error.status = response.status;
        error.data = errorData;

        throw error;
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      }

      return {};
    } catch (error) {
      console.error(`❌ API Error [${options.method || 'GET'} ${url}]:`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * POST with form data (for login)
   */
  async postForm(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: 'Request failed'
        }));
        throw new Error(errorData.detail || 'Request failed');
      }

      return response.json();
    } catch (error) {
      console.error(`❌ Form API Error [POST ${url}]:`, error);
      throw error;
    }
  }
}

export default BaseApiClient;
