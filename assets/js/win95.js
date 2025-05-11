/**
 * Windows 95 Jekyll Theme JavaScript
 * Handles interactive elements like the Start menu, clock, and window controls
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Start Menu
  initStartMenu();
  
  // Initialize Window Controls
  initWindowControls();
  
  // Initialize Dropdowns
  initDropdowns();
  
  // Initialize Clock
  initClock();
  
  // Initialize Tabs
  initTabs();
});

/**
 * Initialize Start Menu functionality
 */
function initStartMenu() {
  const startButton = document.getElementById('win95-start-button');
  const startMenu = document.getElementById('win95-start-menu');
  
  if (startButton && startMenu) {
    startButton.addEventListener('click', function(e) {
      e.stopPropagation();
      startMenu.classList.toggle('active');
    });
    
    // Close start menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
        startMenu.classList.remove('active');
      }
    });
  }
}

/**
 * Initialize Window Controls (minimize, maximize, close)
 */
function initWindowControls() {
  // Close buttons
  const closeButtons = document.querySelectorAll('.win95-btn-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const window = this.closest('.win95-window');
      if (window) {
        // For demo purposes, just hide the window
        window.style.display = 'none';
      }
    });
  });
  
  // Minimize buttons
  const minimizeButtons = document.querySelectorAll('.win95-btn-minimize');
  minimizeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const window = this.closest('.win95-window');
      if (window) {
        // For demo purposes, just reduce opacity
        window.style.opacity = '0.5';
      }
    });
  });
  
  // Maximize buttons
  const maximizeButtons = document.querySelectorAll('.win95-btn-maximize');
  maximizeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const window = this.closest('.win95-window');
      if (window) {
        // For demo purposes, toggle a maximized class
        window.classList.toggle('win95-window-maximized');
      }
    });
  });
}

/**
 * Initialize Dropdown menus (like language selector)
 */
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.win95-dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;
      
      // Close all other dropdowns
      document.querySelectorAll('.win95-dropdown-menu.active').forEach(menu => {
        if (menu !== dropdown) {
          menu.classList.remove('active');
        }
      });
      
      // Toggle this dropdown
      dropdown.classList.toggle('active');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.win95-dropdown-menu.active').forEach(menu => {
      menu.classList.remove('active');
    });
  });
}

/**
 * Initialize the taskbar clock
 */
function initClock() {
  const clockElement = document.getElementById('win95-clock');
  
  if (clockElement) {
    function updateClock() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      
      clockElement.textContent = `${hours}:${minutes} ${ampm}`;
    }
    
    // Update immediately and then every minute
    updateClock();
    setInterval(updateClock, 60000);
  }
}

/**
 * Initialize Tabs functionality
 */
function initTabs() {
  const tabLists = document.querySelectorAll('.win95-tab-list');
  
  tabLists.forEach(tabList => {
    const tabs = tabList.querySelectorAll('.win95-tab');
    const tabContents = tabList.parentElement.querySelectorAll('.win95-tab-content');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        if (tabContents[index]) {
          tabContents[index].classList.add('active');
        }
      });
    });
    
    // Activate first tab by default if none are active
    if (!tabList.querySelector('.win95-tab.active') && tabs.length > 0) {
      tabs[0].click();
    }
  });
}

/**
 * Create a Windows 95 style dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Array} buttons - Array of button labels
 * @param {Function} callback - Callback function when a button is clicked
 */
function win95Dialog(title, message, buttons = ['OK'], callback = null) {
  // Create dialog container
  const dialog = document.createElement('div');
  dialog.className = 'win95-dialog';
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.zIndex = '9999';
  
  // Create dialog window
  const window = document.createElement('div');
  window.className = 'win95-window';
  window.style.minWidth = '300px';
  window.style.maxWidth = '400px';
  
  // Create window header
  const header = document.createElement('div');
  header.className = 'win95-window-header';
  
  const titleElement = document.createElement('div');
  titleElement.className = 'win95-window-title';
  titleElement.textContent = title;
  
  const controls = document.createElement('div');
  controls.className = 'win95-window-controls';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'win95-btn win95-btn-close';
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close');
  
  controls.appendChild(closeButton);
  header.appendChild(titleElement);
  header.appendChild(controls);
  
  // Create window content
  const content = document.createElement('div');
  content.className = 'win95-window-content';
  content.style.textAlign = 'center';
  
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.margin = '16px 0';
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.gap = '8px';
  buttonContainer.style.marginTop = '16px';
  
  buttons.forEach(buttonLabel => {
    const button = document.createElement('button');
    button.className = 'win95-btn';
    button.textContent = buttonLabel;
    button.addEventListener('click', function() {
      document.body.removeChild(dialog);
      if (callback) {
        callback(buttonLabel);
      }
    });
    buttonContainer.appendChild(button);
  });
  
  content.appendChild(messageElement);
  content.appendChild(buttonContainer);
  
  // Assemble dialog
  window.appendChild(header);
  window.appendChild(content);
  dialog.appendChild(window);
  
  // Add event listener to close button
  closeButton.addEventListener('click', function() {
    document.body.removeChild(dialog);
    if (callback) {
      callback(null);
    }
  });
  
  // Add dialog to body
  document.body.appendChild(dialog);
  
  // Return dialog element
  return dialog;
}

// Make dialog function available globally
window.win95Dialog = win95Dialog;