import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import {
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
} from '../templates';

import {
  isServiceWorkerAvailable,
  urlBase64ToUint8Array,
} from '../utils';

import { VAPID_PUBLIC_KEY } from '../config';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });

    const logoutButton = document.querySelector('#logout-button');
    const logoutButtonMobile = document.querySelector('#logout-button-mobile');

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      location.hash = '#/login';
      location.reload();
    };

    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (logoutButtonMobile) logoutButtonMobile.addEventListener('click', handleLogout);

  }

  _updateAuthButton() {
    const token = localStorage.getItem('token');
    const logoutButton = document.querySelector('#logout-button');
    const logoutButtonMobile = document.querySelector('#logout-button-mobile');

    if (token) {
      if (logoutButton) {
        logoutButton.textContent = 'Logout';
        logoutButton.href = 'javascript:void(0)';
      }
      if (logoutButtonMobile) {
        logoutButtonMobile.textContent = 'Logout';
      }
    } else {
      if (logoutButton) {
        logoutButton.textContent = 'Login';
        logoutButton.onclick = () => location.hash = '#/login';
      }
      if (logoutButtonMobile) {
        logoutButtonMobile.textContent = 'Login';
        logoutButtonMobile.onclick = () => location.hash = '#/login';
      }
    }
  }

  async #setupNotificationButton() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    if (!pushNotificationTools) return;

    if (!('Notification' in window)) {
      console.log('Notifications not supported in this browser');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    const renderButton = () => {
      if (subscription) {
        pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
        document.getElementById('subscribe-button').addEventListener('click', async () => {
          await subscription.unsubscribe();
          subscription = null;
          renderButton();
        });
      } else {
        pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
        document.getElementById('subscribe-button').addEventListener('click', async () => {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            try {
              const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
              });
              renderButton();
            } catch (error) {
              console.error('Failed to subscribe:', error);
            }
          }
        });
      }
    };

    renderButton();
  }



  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    const loader = document.querySelector('#loader');

    // Show loader
    loader.style.display = 'flex';

    // Update auth button state
    this._updateAuthButton();

    // Use View Transition API for smooth transitions if available
    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      loader.style.display = 'none';
      if (isServiceWorkerAvailable()) {
        this.#setupNotificationButton();
      }
      return;
    }

    const transition = document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });

    // Hide loader after transition
    transition.finished.finally(() => {
      loader.style.display = 'none';

      if (isServiceWorkerAvailable()) {
        this.#setupNotificationButton();
      }
    });
  }
}

export default App;
