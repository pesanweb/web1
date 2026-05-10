import apiService from './api-service';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  async login(credentials) {
    try {
      const response = await apiService.post('/login', credentials);

      if (response.loginResult) {
        this.setToken(response.loginResult.token);
        this.setUser(response.loginResult);
        return response.loginResult;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post('/register', userData);

      if (response.error) {
        throw new Error(response.message || 'Registration failed');
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if token is expired (simple check - real implementation should check JWT expiration)
  isTokenExpired() {
    if (!this.token) return true;

    try {
      // JWT tokens have 3 parts separated by dots
      const parts = this.token.split('.');
      if (parts.length !== 3) return true;

      // Parse payload
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      // Check if token is expired (with 5 minute buffer)
      return payload.exp < now - 300;
    } catch (error) {
      return true;
    }
  }

  // Refresh user data from server
  async refreshUserData() {
    if (!this.token || this.isTokenExpired()) {
      this.logout();
      return null;
    }

    try {
      const response = await apiService.get('/user/profile');
      this.setUser(response);
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();