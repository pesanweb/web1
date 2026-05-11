import * as UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import NotificationHelper from '../utils/notification-helper';

class App {
    constructor({ content, drawerButton, navigationDrawer }) {
        this._content = content;
        this._drawerButton = drawerButton;
        this._navigationDrawer = navigationDrawer;
        this._currentPath = '';
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

    _getNavigationType(oldPath, newPath) {
        const oldSegments = UrlParser.parsePathname(oldPath);
        const newSegments = UrlParser.parsePathname(newPath);
        // list to detail
        if (oldSegments.resource === 'stories' && !oldSegments.id && newSegments.resource === 'stories' && newSegments.id) {
            return 'list-to-detail';
        }
        // detail to list
        if (oldSegments.resource === 'stories' && oldSegments.id && newSegments.resource === 'stories' && !newSegments.id) {
            return 'detail-to-list';
        }
        return 'other';
    }

    async renderPage() {
        this._showLoader();
        const url = UrlParser.getActiveRoute();
            const currentPathname = UrlParser.getActivePathname();
        const page = routes[url];
        if (page) {
            const navigationType = this._getNavigationType(this._currentPath, UrlParser.getActivePathname());
            const storyId = UrlParser.parseActivePathname().id;
            // Pre-transition for list-to-detail
            if (navigationType === 'list-to-detail' && storyId) {
                const srcImg = document.querySelector(`.story-item[data-storyid="${storyId}"] img`);
                if (srcImg) srcImg.style.viewTransitionName = 'story-image';
            }
            const renderAndAfter = async () => {
                this._content.innerHTML = await page.render();
                await page.afterRender();
                // Post-transition image handling
                if (navigationType === 'detail-to-list' && storyId) {
                    const srcImg = document.querySelector(`.story-item[data-storyid="${storyId}"] img`);
                    if (srcImg) srcImg.style.viewTransitionName = 'story-image';
                }
                if (navigationType === 'list-to-detail') {
                    const detailImg = document.querySelector('#detail-story-image');
                    if (detailImg) detailImg.style.viewTransitionName = 'story-image';
                }
                if (navigationType === 'detail-to-list' && storyId) {
                    const srcImg = document.querySelector(`.story-item[data-storyid="${storyId}"] img`);
                    if (srcImg) srcImg.style.viewTransitionName = 'story-image';
                }
            };
            if (document.startViewTransition) {
                const transition = document.startViewTransition(renderAndAfter);
                transition.finished.then(() => {
                    // Reset viewTransitionName
                    document.querySelectorAll('[style*="view-transition-name"]').forEach(el => {
                    el.style.viewTransitionName = '';
                });
                });
            } else {
                await renderAndAfter();
            }
        } else {
            this._content.innerHTML = '<h2>Halaman tidak ditemukan</h2>';
        }
        this._updateAuthUI();
        this._currentPath = currentPathname;
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
