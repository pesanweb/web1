class AccessibilityManager {
  constructor() {
    this.currentFocusableElements = [];
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
    this.isTrapEnabled = false;
    this.init();
  }

  init() {
    // Add keyboard navigation support
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Add announcement region for screen readers
    this.createAnnouncementRegion();
  }

  createAnnouncementRegion() {
    let announcement = document.getElementById('announcement-region');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'announcement-region';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.setAttribute('role', 'status');
      document.body.appendChild(announcement);
    }
  }

  announce(message) {
    const announcement = document.getElementById('announcement-region');
    if (announcement) {
      announcement.textContent = message;
      // Clear after a delay
      setTimeout(() => {
        announcement.textContent = '';
      }, 1000);
    }
  }

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    this.currentFocusableElements = Array.from(focusableElements);
    this.firstFocusableElement = this.currentFocusableElements[0];
    this.lastFocusableElement = this.currentFocusableElements[this.currentFocusableElements.length - 1];

    this.isTrapEnabled = true;

    // Focus first element
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }

  releaseFocus() {
    this.isTrapEnabled = false;
    this.currentFocusableElements = [];
  }

  handleKeyDown(event) {
    if (!this.isTrapEnabled) return;

    // Tab key navigation
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab: Move to previous element
        if (document.activeElement === this.firstFocusableElement) {
          event.preventDefault();
          this.lastFocusableElement.focus();
        }
      } else {
        // Tab: Move to next element
        if (document.activeElement === this.lastFocusableElement) {
          event.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    }

    // Escape key to release focus
    if (event.key === 'Escape') {
      this.releaseFocus();
      this.announce('Dialog closed');
    }
  }

  // Focus management for modals
  openModal(modalElement) {
    // Store current active element
    this.previousActiveElement = document.activeElement;

    // Trap focus in modal
    this.trapFocus(modalElement);

    // Announce modal opened
    this.announce('Modal opened');
  }

  closeModal() {
    this.releaseFocus();

    // Return focus to previous element
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }

    // Announce modal closed
    this.announce('Modal closed');
  }

  // Enhanced keyboard navigation for drawers
  openDrawer(drawerElement) {
    this.previousActiveElement = document.activeElement;
    this.trapFocus(drawerElement);

    // Announce drawer opened
    this.announce('Navigation drawer opened');
  }

  closeDrawer() {
    this.releaseFocus();

    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }

    // Announce drawer closed
    this.announce('Navigation drawer closed');
  }

  // Add ARIA live region for dynamic content
  announceDynamicContent(message, priority = 'polite') {
    const region = document.getElementById('dynamic-content-region') || this.createLiveRegion(priority);
    region.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      region.textContent = '';
    }, 1000);
  }

  createLiveRegion(priority) {
    const region = document.createElement('div');
    region.id = 'dynamic-content-region';
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    return region;
  }

  // Announce form validation errors
  announceValidationError(message) {
    this.announceDynamicContent(`Error: ${message}`, 'assertive');
  }

  // Announce form success
  announceSuccess(message) {
    this.announceDynamicContent(`Success: ${message}`, 'polite');
  }
}

export default new AccessibilityManager();