/**
 * Windows 95 Jekyll Theme - Dialog Management
 * This file provides functionality for Windows 95-style dialogs
 */

// Dialogs namespace
Win95.Dialogs = {
  // Active dialogs tracking
  activeDialogs: [],
  dialogZIndex: 1000,
  
  // Initialize dialog functionality
  init: function() {
    // Find all dialogs on the page
    const dialogs = document.querySelectorAll('.win95-dialog');
    
    // Initialize each dialog
    dialogs.forEach(dialog => {
      this.initializeDialog(dialog);
    });
  },
  
  // Initialize a single dialog
  initializeDialog: function(dialogElement) {
    // Skip if already initialized
    if (dialogElement.dataset.initialized === 'true') {
      return;
    }
    
    // Set initial state
    dialogElement.dataset.initialized = 'true';
    dialogElement.style.display = 'none';
    
    // Initialize dialog controls
    this.initializeDialogControls(dialogElement);
    
    // Add to active dialogs
    this.activeDialogs.push(dialogElement);
  },
  
  // Initialize dialog control buttons
  initializeDialogControls: function(dialogElement) {
    // Find close button
    const closeBtn = dialogElement.querySelector('.win95-close');
    
    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        Win95.Dialogs.closeDialog(dialogElement);
      });
    }
    
    // Find all buttons in the dialog
    const buttons = dialogElement.querySelectorAll('.win95-dialog-buttons .win95-button');
    
    // Add click handlers to buttons
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const action = this.dataset.action;
        
        if (action === 'close') {
          Win95.Dialogs.closeDialog(dialogElement);
        } else if (typeof action === 'function') {
          // Execute function if it's a function reference
          action.call(dialogElement);
        } else if (typeof action === 'string' && action.startsWith('function')) {
          // Execute function from string representation
          try {
            const fn = new Function('return ' + action)();
            fn.call(dialogElement);
          } catch (e) {
            console.error('Error executing dialog button action:', e);
          }
        }
      });
    });
  },
  
  // Show a dialog
  showDialog: function(options) {
    const defaults = {
      id: 'win95-dialog-' + Date.now(),
      title: 'Dialog',
      content: '',
      type: 'info', // info, warning, error, question
      modal: true,
      width: '300px',
      buttons: [
        {
          text: 'OK',
          primary: true,
          action: 'close'
        }
      ]
    };
    
    // Merge options with defaults
    const settings = Object.assign({}, defaults, options);
    
    // Check if dialog already exists
    let dialogElement = document.getElementById(settings.id);
    
    // Create new dialog if it doesn't exist
    if (!dialogElement) {
      dialogElement = document.createElement('div');
      dialogElement.id = settings.id;
      dialogElement.className = `win95-dialog win95-dialog-${settings.type}`;
      if (settings.modal) {
        dialogElement.classList.add('win95-modal');
      }
      dialogElement.style.width = settings.width;
      
      // Create dialog HTML
      let buttonsHtml = '';
      settings.buttons.forEach(button => {
        const primaryClass = button.primary ? 'win95-button-primary' : '';
        const actionAttr = typeof button.action === 'string' ? 
          `data-action="${button.action}"` : 
          `onclick="(${button.action}).call(this.closest('.win95-dialog'))"`;
        
        buttonsHtml += `
          <button class="win95-button ${primaryClass}" ${actionAttr}>
            ${button.text}
          </button>
        `;
      });
      
      dialogElement.innerHTML = `
        <div class="win95-title-bar">
          <div class="win95-title-bar-text">${settings.title}</div>
          ${!settings.modal ? `
            <div class="win95-title-bar-controls">
              <button class="win95-close" aria-label="Close">
                <span>×</span>
              </button>
            </div>
          ` : ''}
        </div>
        <div class="win95-window-body">
          <div class="win95-dialog-content">
            <div class="win95-dialog-icon win95-dialog-icon-${settings.type}"></div>
            <div class="win95-dialog-message">${settings.content}</div>
          </div>
          <div class="win95-dialog-buttons">
            ${buttonsHtml}
          </div>
        </div>
      `;
      
      // Add to document
      document.body.appendChild(dialogElement);
      
      // Initialize dialog
      this.initializeDialog(dialogElement);
    }
    
    // Show the dialog
    dialogElement.style.display = 'block';
    dialogElement.style.zIndex = ++this.dialogZIndex;
    
    // Add opening animation
    dialogElement.classList.add('win95-dialog-opening');
    setTimeout(() => {
      dialogElement.classList.remove('win95-dialog-opening');
    }, 300);
    
    // Focus the primary button
    const primaryButton = dialogElement.querySelector('.win95-button-primary');
    if (primaryButton) {
      primaryButton.focus();
    }
    
    // Add keyboard event listener for Escape key
    const escHandler = function(e) {
      if (e.key === 'Escape' && !settings.modal) {
        Win95.Dialogs.closeDialog(dialogElement);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    return dialogElement;
  },
  
  // Close a dialog
  closeDialog: function(dialogElement) {
    // Add closing animation
    dialogElement.classList.add('win95-dialog-closing');
    
    // After animation completes, hide the dialog
    setTimeout(() => {
      dialogElement.style.display = 'none';
      dialogElement.classList.remove('win95-dialog-closing');
      
      // Remove from active dialogs if it's a temporary dialog
      if (dialogElement.dataset.temporary === 'true') {
        const index = this.activeDialogs.indexOf(dialogElement);
        if (index > -1) {
          this.activeDialogs.splice(index, 1);
        }
        
        // Remove from DOM
        dialogElement.remove();
      }
    }, 300);
  },
  
  // Show an alert dialog
  alert: function(options) {
    if (typeof options === 'string') {
      options = { content: options };
    }
    
    const settings = Object.assign({
      title: 'Alert',
      type: 'info',
      buttons: [
        {
          text: 'OK',
          primary: true,
          action: 'close'
        }
      ]
    }, options);
    
    return this.showDialog(settings);
  },
  
  // Show a confirm dialog
  confirm: function(options, callback) {
    if (typeof options === 'string') {
      options = { content: options };
    }
    
    const settings = Object.assign({
      title: 'Confirm',
      type: 'question',
      buttons: [
        {
          text: 'OK',
          primary: true,
          action: function() {
            if (typeof callback === 'function') {
              callback(true);
            }
            Win95.Dialogs.closeDialog(this);
          }
        },
        {
          text: 'Cancel',
          action: function() {
            if (typeof callback === 'function') {
              callback(false);
            }
            Win95.Dialogs.closeDialog(this);
          }
        }
      ]
    }, options);
    
    return this.showDialog(settings);
  },
  
  // Show a prompt dialog
  prompt: function(options, callback) {
    if (typeof options === 'string') {
      options = { content: options };
    }
    
    const defaultValue = options.defaultValue || '';
    const content = `
      <p>${options.content}</p>
      <input type="text" class="win95-input win95-prompt-input" value="${defaultValue}">
    `;
    
    const settings = Object.assign({
      title: 'Prompt',
      type: 'question',
      content: content,
      buttons: [
        {
          text: 'OK',
          primary: true,
          action: function() {
            const input = this.querySelector('.win95-prompt-input');
            if (typeof callback === 'function') {
              callback(input.value);
            }
            Win95.Dialogs.closeDialog(this);
          }
        },
        {
          text: 'Cancel',
          action: function() {
            if (typeof callback === 'function') {
              callback(null);
            }
            Win95.Dialogs.closeDialog(this);
          }
        }
      ]
    }, options, { content: content });
    
    const dialog = this.showDialog(settings);
    
    // Focus the input field
    setTimeout(() => {
      const input = dialog.querySelector('.win95-prompt-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
    
    return dialog;
  }
};