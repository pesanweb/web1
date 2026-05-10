class LoadingManager {
  constructor() {
    this.loader = document.getElementById('loader');
    if (!this.loader) {
      console.warn('LoadingManager: #loader element not found');
      this.loader = null;
    }
  }

  show() {
    if (this.loader) {
      this.loader.style.display = 'flex';
    }
  }

  hide() {
    if (this.loader) {
      this.loader.style.display = 'none';
    }
  }

  toggle() {
    if (this.loader) {
      this.loader.style.display = this.loader.style.display === 'flex' ? 'none' : 'flex';
    }
  }
}

export default new LoadingManager();