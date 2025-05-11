/**
 * Windows 95 Jekyll Theme - Window Management
 * This file provides functionality for Windows 95-style window management
 */

// Windows management namespace
Win95.Windows = {
  // Active windows tracking
  activeWindows: [],
  zIndex: 100,
  
  // Initialize window functionality
  init: function() {
    // Find all windows on the page
    const windows = document.querySelectorAll('.win95-window');
    
    // Initialize each window
    windows.forEach(win => {
      this.initializeWindow(win);
    });
    
    // Global click handler to manage window focus
    document.addEventListener('mousedown', function(e) {
      const targetWindow = e.target.closest('.win95-window');
      if (targetWindow) {
        Win95.Windows.bringToFront(targetWindow);
      }
    });
  },
  
  // Initialize a single window
  initializeWindow: function(windowElement) {
    // Skip if already initialized
    if (windowElement.dataset.initialized === 'true') {
      return;
    }
    
    // Set initial state
    windowElement.dataset.initialized = 'true';
    windowElement.dataset.state = 'normal';
    
    // Store original dimensions for restore
    windowElement.dataset.originalWidth = windowElement.style.width || 'auto';
    windowElement.dataset.originalHeight = windowElement.style.height || 'auto';
    windowElement.dataset.originalLeft = windowElement.style.left || 'auto';
    windowElement.dataset.originalTop = windowElement.style.top || 'auto';
    
    // Initialize window controls
    this.initializeWindowControls(windowElement);
    
    // Initialize dragging if window is draggable
    if (windowElement.dataset.draggable !== 'false') {
      this.initializeDragging(windowElement);
    }
    
    // Initialize resizing if window is resizable
    if (windowElement.dataset.resizable === 'true') {
      this.initializeResizing(windowElement);
    }
    
    // Add to active windows
    this.activeWindows.push(windowElement);
    
    // Set initial z-index
    this.bringToFront(windowElement);
  },
  
  // Initialize window control buttons
  initializeWindowControls: function(windowElement) {
    // Find control buttons
    const minimizeBtn = windowElement.querySelector('.win95-minimize');
    const maximizeBtn = windowElement.querySelector('.win95-maximize');
    const closeBtn = windowElement.querySelector('.win95-close');
    
    // Minimize button
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', function() {
        Win95.Windows.minimizeWindow(windowElement);
      });
    }
    
    // Maximize/Restore button
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', function() {
        const state = windowElement.dataset.state;
        if (state === 'maximized') {
          Win95.Windows.restoreWindow(windowElement);
        } else {
          Win95.Windows.maximizeWindow(windowElement);
        }
      });
    }
    
    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        Win95.Windows.closeWindow(windowElement);
      });
    }
  },
  
  // Initialize window dragging
  initializeDragging: function(windowElement) {
    const titleBar = windowElement.querySelector('.win95-title-bar');
    if (!titleBar) return;
    
    let isDragging = false;
    let offsetX, offsetY;
    
    titleBar.addEventListener('mousedown', function(e) {
      // Ignore if clicking on control buttons
      if (e.target.closest('.win95-title-bar-controls')) {
        return;
      }
      
      // Ignore if window is maximized
      if (windowElement.dataset.state === 'maximized') {
        return;
      }
      
      isDragging = true;
      
      // Calculate offset from mouse position to window corner
      const rect = windowElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      
      // Add dragging class
      windowElement.classList.add('win95-dragging');
      
      // Bring window to front
      Win95.Windows.bringToFront(windowElement);
      
      // Prevent text selection during drag
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      
      // Calculate new position
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      // Apply new position
      windowElement.style.left = `${x}px`;
      windowElement.style.top = `${y}px`;
      
      // Ensure the window stays within viewport
      Win95.Windows.constrainToViewport(windowElement);
    });
    
    document.addEventListener('mouseup', function() {
      if (!isDragging) return;
      
      isDragging = false;
      windowElement.classList.remove('win95-dragging');
    });
  },
  
  // Initialize window resizing
  initializeResizing: function(windowElement) {
    const resizeHandle = windowElement.querySelector('.win95-resize-handle');
    if (!resizeHandle) return;
    
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    resizeHandle.addEventListener('mousedown', function(e) {
      // Ignore if window is maximized
      if (windowElement.dataset.state === 'maximized') {
        return;
      }
      
      isResizing = true;
      
      // Store initial values
      startX = e.clientX;
      startY = e.clientY;
      startWidth = windowElement.offsetWidth;
      startHeight = windowElement.offsetHeight;
      
      // Add resizing class
      windowElement.classList.add('win95-resizing');
      
      // Bring window to front
      Win95.Windows.bringToFront(windowElement);
      
      // Prevent text selection during resize
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isResizing) return;
      
      // Calculate new dimensions
      const width = startWidth + (e.clientX - startX);
      const height = startHeight + (e.clientY - startY);
      
      // Apply new dimensions (with minimum size constraints)
      windowElement.style.width = `${Math.max(200, width)}px`;
      windowElement.style.height = `${Math.max(100, height)}px`;
    });
    
    document.addEventListener('mouseup', function() {
      if (!isResizing) return;
      
      isResizing = false;
      windowElement.classList.remove('win95-resizing');
    });
  },
  
  // Bring window to front
  bringToFront: function(windowElement) {
    // Update z-index for all windows
    this.activeWindows.forEach(win => {
      if (win === windowElement) {
        win.style.zIndex = ++this.zIndex;
        win.classList.add('win95-active');
      } else {
        win.classList.remove('win95-active');
      }
    });
    
    // Update taskbar items if they exist
    const windowId = windowElement.id;
    if (windowId) {
      const taskbarItems = document.querySelectorAll('.win95-taskbar-item');
      taskbarItems.forEach(item => {
        if (item.dataset.windowId === windowId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  },
  
  // Minimize window
  minimizeWindow: function(windowElement) {
    // Add minimizing animation class
    windowElement.classList.add('win95-window-minimizing');
    
    // After animation completes, hide the window
    setTimeout(() => {
      windowElement.style.display = 'none';
      windowElement.classList.remove('win95-window-minimizing');
      windowElement.dataset.state = 'minimized';
      
      // Update taskbar item
      this.updateTaskbarItem(windowElement, 'minimized');
    }, 200);
  },
  
  // Maximize window
  maximizeWindow: function(windowElement) {
    // Store current position and size for restore
    if (windowElement.dataset.state === 'normal') {
      windowElement.dataset.restoreWidth = windowElement.style.width;
      windowElement.dataset.restoreHeight = windowElement.style.height;
      windowElement.dataset.restoreLeft = windowElement.style.left;
      windowElement.dataset.restoreTop = windowElement.style.top;
    }
    
    // Add maximizing animation class
    windowElement.classList.add('win95-window-maximizing');
    
    // Set maximized state
    windowElement.style.width = '100%';
    windowElement.style.height = 'calc(100vh - 40px)'; // Leave space for taskbar
    windowElement.style.left = '0';
    windowElement.style.top = '0';
    windowElement.dataset.state = 'maximized';
    
    // Update maximize button icon if it exists
    const maximizeBtn = windowElement.querySelector('.win95-maximize span');
    if (maximizeBtn) {
      maximizeBtn.textContent = '❐';
    }
    
    // Remove animation class after it completes
    setTimeout(() => {
      windowElement.classList.remove('win95-window-maximizing');
    }, 200);
    
    // Update taskbar item
    this.updateTaskbarItem(windowElement, 'maximized');
  },
  
  // Restore window
  restoreWindow: function(windowElement) {
    // Restore from minimized state
    if (windowElement.dataset.state === 'minimized') {
      windowElement.style.display = '';
    }
    
    // Restore from maximized state
    if (windowElement.dataset.state === 'maximized') {
      windowElement.style.width = windowElement.dataset.restoreWidth || windowElement.dataset.originalWidth;
      windowElement.style.height = windowElement.dataset.restoreHeight || windowElement.dataset.originalHeight;
      windowElement.style.left = windowElement.dataset.restoreLeft || windowElement.dataset.originalLeft;
      windowElement.style.top = windowElement.dataset.restoreTop || windowElement.dataset.originalTop;
      
      // Update maximize button icon if it exists
      const maximizeBtn = windowElement.querySelector('.win95-maximize span');
      if (maximizeBtn) {
        maximizeBtn.textContent = '□';
      }
    }
    
    // Set normal state
    windowElement.dataset.state = 'normal';
    
    // Add opening animation class
    windowElement.classList.add('win95-window-opening');
    
    // Remove animation class after it completes
    setTimeout(() => {
      windowElement.classList.remove('win95-window-opening');
    }, 200);
    
    // Bring window to front
    this.bringToFront(windowElement);
    
    // Update taskbar item
    this.updateTaskbarItem(windowElement, 'normal');
  },
  
  // Close window
  closeWindow: function(windowElement) {
    // Add closing animation class
    windowElement.classList.add('win95-window-closing');
    
    // After animation completes, remove the window
    setTimeout(() => {
      // Remove from active windows array
      const index = this.activeWindows.indexOf(windowElement);
      if (index > -1) {
        this.activeWindows.splice(index, 1);
      }
      
      // Remove taskbar item if it exists
      const windowId = windowElement.id;
      if (windowId) {
        const taskbarItem = document.querySelector(`.win95-taskbar-item[data-window-id="${windowId}"]`);
        if (taskbarItem) {
          taskbarItem.remove();
        }
      }
      
      // Hide the window (don't remove from DOM to allow reopening)
      windowElement.style.display = 'none';
      windowElement.classList.remove('win95-window-closing');
      windowElement.dataset.state = 'closed';
    }, 200);
  },
  
  // Constrain window to viewport
  constrainToViewport: function(windowElement) {
    const rect = windowElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Ensure title bar is always accessible
    const titleBarHeight = 30; // Approximate height of title bar
    
    // Constrain left position
    if (rect.right < 100) {
      windowElement.style.left = `${-rect.width + 100}px`;
    }
    
    // Constrain right position
    if (rect.left > viewportWidth - 100) {
      windowElement.style.left = `${viewportWidth - 100}px`;
    }
    
    // Constrain top position
    if (rect.bottom < titleBarHeight) {
      windowElement.style.top = `${-rect.height + titleBarHeight}px`;
    }
    
    // Constrain bottom position
    if (rect.top > viewportHeight - titleBarHeight) {
      windowElement.style.top = `${viewportHeight - titleBarHeight}px`;
    }
  },
  
  // Update taskbar item
  updateTaskbarItem: function(windowElement, state) {
    const windowId = windowElement.id;
    if (!windowId) return;
    
    const taskbarItem = document.querySelector(`.win95-taskbar-item[data-window-id="${windowId}"]`);
    if (!taskbarItem) return;
    
    // Update taskbar item state
    taskbarItem.dataset.state = state;
    
    // Update active state
    if (state === 'normal' || state === 'maximized') {
      taskbarItem.classList.add('active');
    } else {
      taskbarItem.classList.remove('active');
    }
  },
  
  // Create a new window
  createWindow: function(options) {
    const defaults = {
      id: 'win95-window-' + Date.now(),
      title: 'Window',
      content: '',
      width: '400px',
      height: '300px',
      left: '50%',
      top: '50%',
      draggable: true,
      resizable: false,
      minimizable: true,
      maximizable: true,
      closable: true
    };
    
    // Merge options with defaults
    const settings = Object.assign({}, defaults, options);
    
    // Create window element
    const windowElement = document.createElement('div');
    windowElement.id = settings.id;
    windowElement.className = 'win95-window';
    windowElement.dataset.draggable = settings.draggable;
    windowElement.dataset.resizable = settings.resizable;
    windowElement.style.width = settings.width;
    windowElement.style.height = settings.height;
    windowElement.style.left = settings.left;
    windowElement.style.top = settings.top;
    
    // If positioned at 50%, transform to center
    if (settings.left === '50%' && settings.top === '50%') {
      windowElement.style.transform = 'translate(-50%, -50%)';
    }
    
    // Create window HTML
    windowElement.innerHTML = `
      <div class="win95-title-bar">
        <div class="win95-title-bar-text">${settings.title}</div>
        <div class="win95-title-bar-controls">
          ${settings.minimizable ? '<button class="win95-minimize" aria-label="Minimize"><span>_</span></button>' : ''}
          ${settings.maximizable ? '<button class="win95-maximize" aria-label="Maximize"><span>□</span></button>' : ''}
          ${settings.closable ? '<button class="win95-close" aria-label="Close"><span>×</span></button>' : ''}
        </div>
      </div>
      <div class="win95-window-body">
        ${settings.content}
      </div>
      ${settings.resizable ? '<div class="win95-resize-handle"></div>' : ''}
    `;
    
    // Add to document
    document.body.appendChild(windowElement);
    
    // Initialize window
    this.initializeWindow(windowElement);
    
    // Add opening animation
    windowElement.classList.add('win95-window-opening');
    setTimeout(() => {
      windowElement.classList.remove('win95-window-opening');
    }, 200);
    
    // Create taskbar item if taskbar exists
    const taskbar = document.querySelector('.win95-taskbar-items');
    if (taskbar) {
      const taskbarItem = document.createElement('div');
      taskbarItem.className = 'win95-taskbar-item active';
      taskbarItem.dataset.windowId = settings.id;
      taskbarItem.innerHTML = `
        <img src="../images/icons/window.png" alt="" width="16" height="16">
        <span>${settings.title}</span>
      `;
      
      // Add click handler to restore/minimize window
      taskbarItem.addEventListener('click', function() {
        const win = document.getElementById(settings.id);
        if (win) {
          if (win.dataset.state === 'minimized') {
            Win95.Windows.restoreWindow(win);
          } else {
            Win95.Windows.minimizeWindow(win);
          }
        }
      });
      
      taskbar.appendChild(taskbarItem);
    }
    
    return windowElement;
  }
};