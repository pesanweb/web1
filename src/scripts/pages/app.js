import * as UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import NotificationHelper from '../utils/notification-helper';

class App {
    constructor({ content, drawerButton, navigationDrawer }) {
        this._content = content;
        this._drawerButton = drawerButton;
        this._navigationDrawer = navigationDrawer;

        this._initialAppShell();
    }

    _initialAppShell() {
        const drawerOverlay = document.querySelector('#drawer-overlay');
        const closeDrawerButton = document.querySelector('#close-drawer');

        this._drawerButton.addEventListener('click', (event) => {
            this._toggleDrawer(event);
        });

        if (closeDrawerButton) {
            closeDrawerButton.addEventListener('click', (event) => {
                this._toggleDrawer(event);
            });
        }

        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', (event) => {
                this._toggleDrawer(event);
            });
        }

        this._updateAuthUI();
        this._initNotification();
    }

    _updateAuthUI() {
        const token = localStorage.getItem('token');
        const logoutButton = document.querySelector('#logout-button');
        const logoutButtonMobile = document.querySelector('#logout-button-mobile');

        const updateButton = (btn) => {
            if (!btn) return;
            if (token) {
                btn.innerText = 'Logout';
                btn.onclick = () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    alert('Logout Berhasil');
                    location.hash = '#/login';
                    this._updateAuthUI();
                };
            } else {
                btn.innerText = 'Login';
                btn.onclick = () => {
                    location.hash = '#/login';
                };
            }
        };

        updateButton(logoutButton);
        updateButton(logoutButtonMobile);
    }

    async _initNotification() {
        const container = document.querySelector('#push-notification-tools');
        if (container) {
            await NotificationHelper.init(container);
        }
    }

    _toggleDrawer(event) {
        event.stopPropagation();
        this._navigationDrawer.classList.toggle('-translate-x-full');
        const drawerOverlay = document.querySelector('#drawer-overlay');
        if (drawerOverlay) {
            drawerOverlay.classList.toggle('active');
        }
    }

    async renderPage() {
        this._showLoader();
        const url = UrlParser.getActiveRoute();
        const page = routes[url];
        if (page) {
            this._content.innerHTML = await page.render();
            await page.afterRender();
        } else {
            this._content.innerHTML = '<h2>Halaman tidak ditemukan</h2>';
        }
        this._updateAuthUI();
        this._hideLoader();
    }

    _showLoader() {
        const loader = document.querySelector('#loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    _hideLoader() {
        const loader = document.querySelector('#loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

export default App;
