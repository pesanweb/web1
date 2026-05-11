import NotificationHelper from './notification-helper';

/**
 * Initialize push‑notification handling.
 * @param {HTMLElement} container - Element where the subscribe button will be rendered.
 */
export const subscribeToPushNotifications = async (container) => {
  await NotificationHelper.init(container);
};
