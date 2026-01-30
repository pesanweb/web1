import CONFIG from '../config';

class StoriesApi {
  static async register({ name, email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async login({ email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(error.message);
    }
  }


  static async getAllStories({ location = 0 } = {}) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories?location=${location}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getStoryDetail(id) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async addStory({ description, photo, lat, lon }) {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);

      if (lat) formData.append('lat', lat);
      if (lon) formData.append('lon', lon);

      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      if (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized')) {
        alert('Sesi anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('token');
        location.hash = '#/login';
      }
      throw new Error(error.message);
    }
  }
}

export default StoriesApi;
