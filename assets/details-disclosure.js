class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    
    // Add event listeners for hover
    this.mainDetailsToggle.addEventListener('mouseenter', this.open.bind(this));
    this.mainDetailsToggle.addEventListener('mouseleave', this.close.bind(this));
    
    // Add click event listener for navigation
    const summaryElement = this.mainDetailsToggle.querySelector('summary');
    summaryElement.addEventListener('click', this.handleSummaryClick.bind(this));
  }
  
  // Handle click on summary element
  handleSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const url = summaryElement.getAttribute('data-url');
    
    if (url) {
      // Prevent the default behavior (toggling the dropdown)
      event.preventDefault();
      
      // Navigate to the URL
      window.location.href = url;
    }
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
  
  // Add method to open dropdown
  open() {
    this.mainDetailsToggle.setAttribute('open', true);
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', true);
  }
}

customElements.define('header-menu', HeaderMenu);

// Add class for submenu items with dropdowns
class HeaderSubMenu extends DetailsDisclosure {
  constructor() {
    super();
    
    // Add hover functionality
    this.mainDetailsToggle.addEventListener('mouseenter', this.open.bind(this));
    this.mainDetailsToggle.addEventListener('mouseleave', this.close.bind(this));
    
    // Add click event listener for navigation
    const summaryElement = this.mainDetailsToggle.querySelector('summary');
    if (summaryElement.hasAttribute('data-url')) {
      summaryElement.addEventListener('click', this.handleSummaryClick.bind(this));
    }
  }
  
  // Add method to open dropdown
  open() {
    this.mainDetailsToggle.setAttribute('open', true);
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', true);
  }
  
  // Handle click on summary element
  handleSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const url = summaryElement.getAttribute('data-url');
    
    if (url) {
      // Prevent the default behavior (toggling the dropdown)
      event.preventDefault();
      
      // Navigate to the URL
      window.location.href = url;
    }
  }
}

// Initialize HeaderSubMenu for all submenu items with dropdowns
document.addEventListener('DOMContentLoaded', () => {
  const subMenus = document.querySelectorAll('details[id^="Details-HeaderSubMenu-"]');
  subMenus.forEach(subMenu => {
    const subMenuElement = document.createElement('header-sub-menu');
    subMenu.parentNode.insertBefore(subMenuElement, subMenu);
    subMenuElement.appendChild(subMenu);
  });
});

customElements.define('header-sub-menu', HeaderSubMenu);
