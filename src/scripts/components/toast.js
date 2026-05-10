class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = new Map();
    this.init();
  }

  init() {
    // Create container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  show(message, options = {}) {
    const {
      type = 'info',
      duration = 3000,
      position = 'top-right',
      action = null,
      dismissible = true
    } = options;

    const id = Date.now().toString();
    const toast = this.createToast(id, message, type, action, dismissible);

    this.container.appendChild(toast);
    this.toasts.set(id, toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add('animate-in', 'slide-in-from-top');
    }, 10);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.hide(id);
      }, duration);
    }

    return id;
  }

  createToast(id, message, type, action, dismissible) {
    const toast = document.createElement('div');
    toast.id = `toast-${id}`;
    toast.className = `
      min-w-[300px] max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-sm
      ${this.getTypeStyles(type)}
      transition-all duration-300 transform
    `;

    const content = document.createElement('div');
    content.className = 'flex items-center justify-between';
    content.innerHTML = `
      <span class="text-sm font-medium">${message}</span>
      ${dismissible ? `
        <button onclick="toastManager.hide('${id}')" class="ml-4 flex-shrink-0">
          <svg class="w-4 h-4 current opacity-70 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      ` : ''}
    `;

    if (action) {
      const actionButton = document.createElement('button');
      actionButton.className = 'ml-3 px-3 py-1 text-xs font-medium rounded transition-colors';
      actionButton.textContent = action.text;
      actionButton.className += ` ${action.type === 'primary' ? 'bg-white bg-opacity-20 hover:bg-opacity-30' : 'bg-white bg-opacity-10 hover:bg-opacity-20'}`;
      actionButton.onclick = action.onClick;
      content.appendChild(actionButton);
    }

    toast.appendChild(content);
    return toast;
  }

  getTypeStyles(type) {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border border-green-600';
      case 'error':
        return 'bg-red-500 text-white border border-red-600';
      case 'warning':
        return 'bg-yellow-500 text-white border border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 text-white border border-blue-600';
    }
  }

  hide(id) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.classList.add('animate-out', 'fade-out', 'slide-out-to-top');

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts.delete(id);
      }, 300);
    }
  }

  success(message, options = {}) {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message, options = {}) {
    return this.show(message, { ...options, type: 'error' });
  }

  warning(message, options = {}) {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message, options = {}) {
    return this.show(message, { ...options, type: 'info' });
  }

  clear() {
    this.toasts.forEach((toast, id) => {
      this.hide(id);
    });
  }
}

// Create singleton instance
const toastManager = new ToastManager();

export default toastManager;