import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

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

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    const loader = document.querySelector('#loader');

    // Show loader
    loader.style.display = 'flex';

    // Use View Transition API for smooth transitions
    const transition = document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });

    // Hide loader after transition
    transition.finished.finally(() => {
      loader.style.display = 'none';
    });
  }
}

export default App;
