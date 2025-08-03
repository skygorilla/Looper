// Popup script for Looper - Inject Real Component
document.addEventListener('DOMContentLoaded', function() {
  const togglePanelBtn = document.getElementById('togglePanel');
  const refreshPageBtn = document.getElementById('refreshPage');
  const panelStatusEl = document.getElementById('panelStatus');
  const targetStatusEl = document.getElementById('targetStatus');

  // Auto-open panel when popup opens
  openLooperPanel();

  // Toggle panel button
  togglePanelBtn.addEventListener('click', openLooperPanel);

  // Refresh page button
  refreshPageBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    });
  });

  // Open Looper panel function
  function openLooperPanel() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      
      // Check if it's a chrome:// URL and skip
      if (tabs[0].url && tabs[0].url.startsWith('chrome://')) {
        panelStatusEl.textContent = 'Cannot inject on chrome:// pages';
        return;
      }
      
      // Inject the actual LooperAutopilotAdvanced component from Firebase project
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
          // Remove existing panel if any
          const existing = document.getElementById('looper-extension-root');
          if (existing) existing.remove();
          
          // Create iframe to load the Firebase project
          const iframe = document.createElement('iframe');
          iframe.id = 'looper-extension-root';
          iframe.src = 'https://looper-61c39.web.app';
          iframe.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            border: none;
            background: transparent;
            pointer-events: none;
          `;
          
          // Make iframe content interactive
          iframe.onload = function() {
            iframe.style.pointerEvents = 'auto';
            
            // Add close button overlay
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 1000000;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: rgba(0,0,0,0.8);
              color: white;
              border: none;
              font-size: 24px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            `;
            closeBtn.onclick = function() {
              iframe.remove();
              closeBtn.remove();
            };
            
            document.body.appendChild(closeBtn);
          };
          
          document.body.appendChild(iframe);
          
          return { success: true, injected: true };
        }
      }, function(results) {
        if (chrome.runtime.lastError) {
          panelStatusEl.textContent = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }
        
        if (results && results[0] && results[0].result && results[0].result.success) {
          panelStatusEl.textContent = 'Active';
          togglePanelBtn.textContent = 'Hide Panel';
        }
      });
    });
  }
});