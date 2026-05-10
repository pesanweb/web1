const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
  VAPID_PUBLIC_KEY: 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk',
};

// Load local config overrides if available
let mergedConfig = CONFIG;

// For browser: try to load config.local.json dynamically
if (typeof window !== 'undefined') {
  // Create a script element to load config.local.json
  const script = document.createElement('script');
  script.src = 'config.local.json';
  script.type = 'application/json';
  script.id = 'local-config';

  script.onload = function() {
    try {
      const localConfig = JSON.parse(script.textContent);
      mergedConfig = { ...CONFIG, ...localConfig };
    } catch (error) {
      // Invalid JSON, use default config
      console.warn('Failed to parse config.local.json:', error);
    }
  };

  script.onerror = function() {
    // File not found, use default config
  };

  // Add to document but don't append to DOM to avoid network request
  Object.defineProperty(script, 'textContent', {
    set: function(value) {
      this._textContent = value;
      try {
        const localConfig = JSON.parse(value);
        mergedConfig = { ...CONFIG, ...localConfig };
      } catch (error) {
        console.warn('Failed to parse config.local.json:', error);
      }
    },
    get: function() {
      return this._textContent || '';
    }
  });

  // Try to load from localStorage as fallback
  try {
    const localConfigJson = localStorage.getItem('config.local.json');
    if (localConfigJson) {
      const localConfig = JSON.parse(localConfigJson);
      mergedConfig = { ...CONFIG, ...localConfig };
    }
  } catch (error) {
    console.warn('Failed to load config from localStorage:', error);
  }
}

export default mergedConfig;
export { CONFIG as defaultConfig };

