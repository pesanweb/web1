import CONFIG from '../config';

class ApiService {
  constructor() {
    this.baseURL = CONFIG.BASE_URL;
    this.token = localStorage.getItem('token');
    this.refreshTokenPromise = null;
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Add token to requests that need authentication
    this.addRequestInterceptor((config) => {
      if (this.needsAuth(config.url) && this.token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${this.token}`
        };
      }
      return config;
    });

    // Handle authentication errors
    this.addResponseInterceptor(async (response) => {
      if (response.status === 401 && this.needsAuth(response.url)) {
        if (!this.refreshTokenPromise) {
          this.refreshTokenPromise = this.handleAuthError();
        }
        await this.refreshTokenPromise;
        this.refreshTokenPromise = null;

        // Retry the original request with new token
        return this.retryRequest(response.config);
      }
      return response;
    });

    // Handle other errors
    this.addResponseInterceptor((response) => {
      if (!response.ok) {
        const error = new Error(response.message || response.statusText || 'Request failed');
        error.status = response.status;
        throw error;
      }
      return response;
    });
  }

  needsAuth(url) {
    return !url.includes('/login') && !url.includes('/register');
  }

  async handleAuthError() {
    // Clear token and redirect to login
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.hash = '#/login';
  }

  async retryRequest(config) {
    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`
      };
    }
    return this.request(config);
  }

  async request(config) {
    const { url, method = 'GET', headers = {}, body, timeout = 10000 } = config;
    const fullUrl = `${this.baseURL}${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body && typeof body === 'string' ? body : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || response.statusText);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  // HTTP methods
  async get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }

  async post(url, body, config = {}) {
    return this.request({ ...config, url, method: 'POST', body: JSON.stringify(body) });
  }

  async put(url, body, config = {}) {
    return this.request({ ...config, url, method: 'PUT', body: JSON.stringify(body) });
  }

  async delete(url, config = {}) {
    return this.request({ ...config, url, method: 'DELETE' });
  }

  // File upload support
  async upload(url, formData, config = {}) {
    const { onProgress } = config;
    const fullUrl = `${this.baseURL}${url}`;

    const controller = new AbortController();

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Upload timeout');
      }
      throw error;
    }
  }

  // Request/response interceptors
  addRequestInterceptor(interceptor) {
    if (!this.requestInterceptors) {
      this.requestInterceptors = [];
    }
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    if (!this.responseInterceptors) {
      this.responseInterceptors = [];
    }
    this.responseInterceptors.push(interceptor);
  }

  // Set token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;