/**
 * Windows 95 Jekyll Theme - Core JavaScript
 * This file provides core functionality for the Windows 95-inspired UI
 */

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all Windows 95 UI components
  Win95.init();
});

// Windows 95 UI namespace
const Win95 = {
  // Initialize all components
  init: function() {
    this.initializeTheme();
    this.initializeAccessibility();
    this.initializeResponsiveness();
    
    // Initialize specific components
    Win95.Windows.init();
    Win95.Dialogs.init();
    Win95.Menu.init();
    
    console.log('Windows 95 UI initialized');
  },
  
  // Initialize theme settings
  initializeTheme: function() {
    // Check for saved theme preferences
    const savedTheme = localStorage.getItem('win95-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Add theme toggle functionality if present
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'default';
        const newTheme = currentTheme === 'default' ? 'high-contrast' : 'default';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('win95-theme', newTheme);
      });
    }
  },
  
  // Initialize accessibility features
  initializeAccessibility: function() {
    // Add focus outlines for keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-navigation');
    });
    
    // Add ARIA attributes to elements that need them
    document.querySelectorAll('.win95-button:not([aria-label])').forEach(button => {
      const buttonText = button.textContent.trim();
      if (buttonText) {
        button.setAttribute('aria-label', buttonText);
      }
    });
  },
  
  // Initialize responsive behavior
  initializeResponsiveness: function() {
    // Handle window resize events
    window.addEventListener('resize', this.debounce(function() {
      // Adjust UI elements based on screen size
      Win95.adjustForScreenSize();
    }, 250));
    
    // Initial adjustment
    Win95.adjustForScreenSize();
  },
  
  // Adjust UI elements based on screen size
  adjustForScreenSize: function() {
    const width = window.innerWidth;
    
    // Mobile adjustments (under 768px)
    if (width < 768) {
      document.body.classList.add('win95-mobile');
      document.body.classList.remove('win95-desktop');
    } else {
      document.body.classList.add('win95-desktop');
      document.body.classList.remove('win95-mobile');
    }
  },
  
  // Utility function to debounce function calls
  debounce: function(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  },
  
  // Show a Windows 95 style alert
  alert: function(message, title = 'Alert', type = 'info') {
    Win95.Dialogs.showDialog({
      title: title,
      content: message,
      type: type,
      buttons: [
        {
          text: 'OK',
          primary: true,
          action: 'close'
        }
      ]
    });
  },
  
  // Show a Windows 95 style confirmation dialog
  confirm: function(message, callback, title = 'Confirm', type = 'question') {
    Win95.Dialogs.showDialog({
      title: title,
      content: message,
      type: type,
      buttons: [
        {
          text: 'OK',
          primary: true,
          action: function() {
            if (typeof callback === 'function') {
              callback(true);
            }
            this.close();
          }
        },
        {
          text: 'Cancel',
          action: function() {
            if (typeof callback === 'function') {
              callback(false);
            }
            this.close();
          }
        }
      ]
    });
  },
  
  // Show a Windows 95 style prompt dialog
  prompt: function(message, defaultValue = '', callback, title = 'Prompt') {
    const content = `
      <p>${message}</p>
      <input type="text" class="win95-input win95-prompt-input" value="${defaultValue}">
    `;
    
    Win95.Dialogs.showDialog({
      title: title,
      content: content,
      type: 'question',
      buttons: [
        {
          text: 'OK',
          primary: true,
          action: function() {
            const input = document.querySelector('.win95-prompt-input');
            if (typeof callback === 'function') {
              callback(input.value);
            }
            this.close();
          }
        },
        {
          text: 'Cancel',
          action: function() {
            if (typeof callback === 'function') {
              callback(null);
            }
            this.close();
          }
        }
      ]
    });
    
    // Focus the input field
    setTimeout(() => {
      const input = document.querySelector('.win95-prompt-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }
};