import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-database';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'favorites';

class FavoritesStore {
  constructor() {
    this.dbPromise = this.initDB();
    this.eventListeners = new Map();
  }

  async initDB() {
    return openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
          db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }

  async getStory(id) {
    if (!id) return null;
    try {
      const db = await this.dbPromise;
      return db.get(OBJECT_STORE_NAME, id);
    } catch (error) {
      console.error('Failed to get story:', error);
      return null;
    }
  }

  async getAllStories() {
    try {
      const db = await this.dbPromise;
      return db.getAll(OBJECT_STORE_NAME);
    } catch (error) {
      console.error('Failed to get all stories:', error);
      return [];
    }
  }

  async putStory(story) {
    if (!story || !story.hasOwnProperty('id')) {
      throw new Error('Story must have an id');
    }

    try {
      const db = await this.dbPromise;
      const result = await db.put(OBJECT_STORE_NAME, story);
      this.emit('added', story);
      return result;
    } catch (error) {
      console.error('Failed to put story:', error);
      throw error;
    }
  }

  async deleteStory(id) {
    if (!id) {
      throw new Error('Story id is required');
    }

    try {
      const db = await this.dbPromise;
      await db.delete(OBJECT_STORE_NAME, id);
      this.emit('removed', { id });
      return true;
    } catch (error) {
      console.error('Failed to delete story:', error);
      throw error;
    }
  }

  async isFavorite(id) {
    try {
      const story = await this.getStory(id);
      return !!story;
    } catch (error) {
      return false;
    }
  }

  async toggleFavorite(story) {
    if (!story || !story.id) {
      throw new Error('Story must have an id');
    }

    const isFav = await this.isFavorite(story.id);

    if (isFav) {
      await this.deleteStory(story.id);
      return { action: 'removed', story };
    } else {
      await this.putStory(story);
      return { action: 'added', story };
    }
  }

  async clearAll() {
    try {
      const db = await this.dbPromise;
      await db.clear(OBJECT_STORE_NAME);
      this.emit('cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear all favorites:', error);
      throw error;
    }
  }

  async count() {
    try {
      const db = await this.dbPromise;
      return db.count(OBJECT_STORE_NAME);
    } catch (error) {
      console.error('Failed to count favorites:', error);
      return 0;
    }
  }

  // Event system
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Initialize with some sample data (for development)
  async initSampleData() {
    try {
      const count = await this.count();
      if (count === 0) {
        const sampleStories = [
          {
            id: 'sample-1',
            description: 'Sample story 1',
            photoUrl: 'https://via.placeholder.com/300',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sample-2',
            description: 'Sample story 2',
            photoUrl: 'https://via.placeholder.com/300',
            createdAt: new Date().toISOString(),
          }
        ];

        for (const story of sampleStories) {
          await this.putStory(story);
        }
      }
    } catch (error) {
      console.error('Failed to init sample data:', error);
    }
  }

  // Export/Import functionality
  async exportData() {
    try {
      const stories = await this.getAllStories();
      return JSON.stringify(stories, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  async importData(jsonData) {
    try {
      const stories = JSON.parse(jsonData);
      if (!Array.isArray(stories)) {
        throw new Error('Import data must be an array');
      }

      await this.clearAll();

      for (const story of stories) {
        if (story && story.id) {
          await this.putStory(story);
        }
      }

      return stories.length;
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const favoritesStore = new FavoritesStore();

export default favoritesStore;