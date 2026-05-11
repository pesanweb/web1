// Base URL injected at build time via webpack DefinePlugin
// Fallback to '/v1' for development when the constant is not defined
const BASE_URL = typeof __BASE_URL__ !== 'undefined' ? __BASE_URL__ : '/v1';

const CONFIG = {
  BASE_URL,
  VAPID_PUBLIC_KEY: 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk',
};

// Endpoints built from the injected base URL
export const ENDPOINTS = {
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/unsubscribe`,
};

export default CONFIG; // default export is the config object
export const VAPID_PUBLIC_KEY = CONFIG.VAPID_PUBLIC_KEY;
export { CONFIG as defaultConfig };