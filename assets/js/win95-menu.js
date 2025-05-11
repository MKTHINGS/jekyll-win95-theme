/**
 * Windows 95 Jekyll Theme - Menu Management
 * This file provides functionality for Windows 95-style menus
 */

// Menu namespace
Win95.Menu = {
  // Active menus tracking
  activeMenus: [],
  
  // Initialize menu functionality
  init: function() {
    // Initialize Start menu
    this.initializeStartMenu();
    
    // Initialize dropdown menus
    this.initializeDropdownMenus();
    
    // Global click handler to close menus when clicking outside
    document.addEventListener('click', function(e) {
      // Skip if clicking inside a menu
      if (e.target.closest('.win95-menu, .win95-dropdown-menu, .win95-start-menu')) {
        return;
      }
      
      // Skip if clicking on a menu toggle
      if (e.target.closest('.win95-start-button, .dropdown-toggle')) {
        return;
      }
      
      // Close all open menus
      Win95.Menu.closeAllMenus();
    });
  },
  
  // Initialize Start menu
  initializeStartMenu: function() {
    const startButton = document.querySelector('.win95-start-button');
    const startMenu = document.querySelector('.win95-start-menu');
    
    if (!startButton || !startMenu) return;
    
    // Toggle Start menu on click
    startButton.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Toggle active class on button
      this.classList.toggle('active');
      
      // Toggle menu visibility
      if (startMenu.classList.contains('show')) {
        startMenu.classList.remove('show');
      } else {
        // Close other menus first
        Win95.Menu.closeAllMenus();
        
        // Show Start menu
        startMenu.classList.add('show');
      }
    });
    
    // Initialize Start menu items
    const menuItems = startMenu.querySelectorAll('.win95-start-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Check if item has a submenu
        const submenu = this.querySelector('.win95-start-submenu');
        if (submenu) {
          e.stopPropagation();
          
          // Toggle submenu visibility
          submenu.classList.toggle('show');
        } else {
          // Close Start menu after clicking an item
          startMenu.classList.remove('show');
          startButton.classList.remove('active');
        }
      });
    });
  },
  
  // Initialize dropdown menus
  initializeDropdownMenus: function() {
    const dropdownToggles = document.querySelectorAll('.win95-dropdown .dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = this.closest('.win95-dropdown');
        const menu = dropdown.querySelector('.win95-dropdown-menu');
        const expanded = this.getAttribute('aria-expanded') === 'true';
        
        // Close all other open dropdowns
        Win95.Menu.closeAllMenus();
        
        // Toggle current dropdown
        this.setAttribute('aria-expanded', !expanded);
        if (!expanded) {
          menu.classList.add('show');
          
          // Add to active menus
          Win95.Menu.activeMenus.push(menu);
        }
      });
    });
    
    // Add click handlers to dropdown items
    const dropdownItems = document.querySelectorAll('.win95-dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Check if item has a submenu
        const submenu = this.querySelector('.win95-dropdown-submenu');
        if (submenu) {
          e.stopPropagation();
          
          // Toggle submenu visibility
          submenu.classList.toggle('show');
        } else {
          // Close dropdown after clicking an item
          const dropdown = this.closest('.win95-dropdown-menu');
          if (dropdown) {
            dropdown.classList.remove('show');
            
            // Update toggle button
            const toggle = dropdown.previousElementSibling;
            if (toggle) {
              toggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });
    });
  },
  
  // Close all open menus
  closeAllMenus: function() {
    // Close Start menu
    const startMenu = document.querySelector('.win95-start-menu');
    const startButton = document.querySelector('.win95-start-button');
    
    if (startMenu && startMenu.classList.contains('show')) {
      startMenu.classList.remove('show');
      if (startButton) {
        startButton.classList.remove('active');
      }
    }
    
    // Close dropdown menus
    document.querySelectorAll('.win95-dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
      
      // Update toggle button
      const toggle = menu.previousElementSibling;
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Clear active menus array
    this.activeMenus = [];
  },
  
  // Create a context menu
  createContextMenu: function(options) {
    const defaults = {
      id: 'win95-context-menu-' + Date.now(),
      items: []
    };
    
    // Merge options with defaults
    const settings = Object.assign({}, defaults, options);
    
    // Remove existing context menu with the same ID
    const existingMenu = document.getElementById(settings.id);
    if (existingMenu) {
      existingMenu.remove();
    }
    
    // Create menu element
    const menuElement = document.createElement('div');
    menuElement.id = settings.id;
    menuElement.className = 'win95-context-menu win95-dropdown-menu';
    
    // Create menu items
    let menuHtml = '';
    settings.items.forEach(item => {
      if (item.separator) {
        menuHtml += '<div class="win95-dropdown-divider"></div>';
      } else {
        const disabled = item.disabled ? 'disabled' : '';
        const icon = item.icon ? `<img src="${item.icon}" alt="" width="16" height="16">` : '';
        
        menuHtml += `
          <a class="win95-dropdown-item ${disabled}" href="#" data-action="${item.action || ''}">
            ${icon}
            <span>${item.text}</span>
            ${item.shortcut ? `<span class="win95-dropdown-shortcut">${item.shortcut}</span>` : ''}
          </a>
        `;
      }
    });
    
    menuElement.innerHTML = menuHtml;
    
    // Add to document
    document.body.appendChild(menuElement);
    
    // Add click handlers to menu items
    const menuItems = menuElement.querySelectorAll('.win95-dropdown-item:not(.disabled)');
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Execute action if defined
        const action = this.dataset.action;
        if (action && typeof window[action] === 'function') {
          window[action]();
        }
        
        // Close the menu
        menuElement.remove();
      });
    });
    
    return menuElement;
  },
  
  // Show context menu at position
  showContextMenu: function(menu, x, y) {
    // Position the menu
    menu.style.display = 'block';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    
    // Adjust position if menu would go off screen
    const rect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    if (rect.right > windowWidth) {
      menu.style.left = `${windowWidth - rect.width}px`;
    }
    
    if (rect.bottom > windowHeight) {
      menu.style.top = `${windowHeight - rect.height}px`;
    }
    
    // Add to active menus
    this.activeMenus.push(menu);
    
    // Add click handler to close menu when clicking outside
    setTimeout(() => {
      const closeHandler = function(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeHandler);
        }
      };
      
      document.addEventListener('click', closeHandler);
    }, 0);
  },
  
  // Initialize context menu for an element
  initializeContextMenu: function(element, menuItems) {
    element.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      
      // Create context menu
      const menu = Win95.Menu.createContextMenu({
        items: menuItems
      });
      
      // Show context menu at mouse position
      Win95.Menu.showContextMenu(menu, e.clientX, e.clientY);
    });
  }
};