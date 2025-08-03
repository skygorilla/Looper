// Popup script for Looper v2
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
      
      // Inject the Looper v2 interface directly
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
          // Remove existing panel if any
          const existing = document.getElementById('looper-v2-extension');
          if (existing) existing.remove();
          
          // Create the Looper v2 interface
          const looperContainer = document.createElement('div');
          looperContainer.id = 'looper-v2-extension';
          looperContainer.innerHTML = `
            <style>
              #looper-v2-extension {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 999999;
                pointer-events: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              .looper-interface {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                pointer-events: auto;
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 20px;
                align-items: center;
                justify-items: center;
                padding: 20px;
              }
              .looper-tab {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
                box-shadow: 10px 15px 40px #000000, -10px -15px 40px #2F393D;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
              }
              .looper-tab:hover {
                box-shadow: 6px 6px 12px rgba(0,0,0,0.7), -6px -6px 12px rgba(47,57,61,0.7);
                transform: scale(1.05);
              }
              .looper-panel {
                width: 300px;
                height: 652px;
                padding: 28px;
                border-radius: 60px;
                background: linear-gradient(135deg, #353A40 0%, #16171B 100%);
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                color: white;
                position: relative;
              }
              .looper-close {
                position: absolute;
                top: -20px;
                right: -20px;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
                box-shadow: 10px 15px 40px #000000, -10px -15px 40px #2F393D;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .looper-stats {
                background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 24px;
                box-shadow: inset 14px 14px 40px rgba(16,16,18,0.75), inset -7px -7px 30px #262E32;
              }
              .looper-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
              }
              .looper-btn {
                flex: 1;
                height: 56px;
                border-radius: 16px;
                background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
                box-shadow: 10px 15px 40px #000000, -10px -15px 40px #2F393D;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              }
              .looper-btn:hover {
                box-shadow: 6px 6px 12px rgba(0,0,0,0.7), -6px -6px 12px rgba(47,57,61,0.7);
              }
              .looper-textarea {
                width: 100%;
                flex-grow: 1;
                padding: 16px;
                border-radius: 16px;
                background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
                box-shadow: inset 12px 12px 24px rgba(16,16,18,0.75), inset -12px -12px 24px #262E32;
                color: white;
                font-size: 14px;
                border: none;
                resize: none;
                margin-bottom: 20px;
                outline: none;
              }
              .looper-textarea::placeholder {
                color: #6b7280;
              }
            </style>
            
            <div class="looper-interface">
              <!-- Left Tabs -->
              <div style="display: flex; flex-direction: column; gap: 20px;">
                <div class="looper-tab" onclick="toggleDevTools()">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                    <polyline points="4,17 10,11 4,5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                  </svg>
                </div>
              </div>

              <!-- Central Panel -->
              <div class="looper-panel">
                <button class="looper-close" onclick="document.getElementById('looper-v2-extension').remove()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="color: white; font-weight: 600; margin-bottom: 12px;">Looper v2</div>
                  <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Ready</div>
                </div>

                <!-- Stats -->
                <div class="looper-stats">
                  <div style="display: flex; justify-content: space-around; align-items: center;">
                    <div style="text-align: center;">
                      <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Session</div>
                      <div style="font-size: 24px; font-weight: 600; color: white;">0</div>
                    </div>
                    <div style="width: 2px; height: 32px; background: linear-gradient(to bottom, #16171B 0%, #353A40 100%); border-radius: 2px;"></div>
                    <div style="text-align: center;">
                      <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Total</div>
                      <div style="font-size: 24px; font-weight: 600; color: white;">0</div>
                    </div>
                  </div>
                </div>

                <!-- Controls -->
                <div class="looper-controls">
                  <button class="looper-btn" onclick="startLooper()" style="color: #3b82f6;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                  </button>
                  <button class="looper-btn" style="color: #f59e0b;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  </button>
                  <button class="looper-btn" style="color: #10b981;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="1,4 1,10 7,10"></polyline>
                      <path d="M3.51,15a9,9,0,0,0,13.48,0"></path>
                    </svg>
                  </button>
                </div>

                <!-- Textarea -->
                <textarea id="starterPrompt" class="looper-textarea" placeholder="🤖 Smart Analysis Mode: Analyzing current page context..."></textarea>

                <!-- Inject Button -->
                <button class="looper-btn" onclick="injectPrompt()" style="color: #10b981; margin-bottom: 20px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
                  </svg>
                </button>

                <!-- Footer -->
                <div style="text-align: center; font-size: 12px; color: #6b7280; margin-top: auto;">
                  Looper Autopilot v2
                </div>
              </div>

              <!-- Right Tabs -->
              <div style="display: flex; flex-direction: column; gap: 20px;">
                <div class="looper-tab" onclick="loadFullScan()" style="color: #3b82f6;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div class="looper-tab">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M3 3v5h5"></path>
                    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                    <path d="M12 7v5l4 2"></path>
                  </svg>
                </div>
                <div class="looper-tab">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          `;
          
          document.body.appendChild(looperContainer);
          
          // Add functionality
          window.startLooper = function() {
            const textarea = document.getElementById('starterPrompt');
            if (textarea) {
              textarea.value = 'scan app and do not change anithing';
              textarea.focus();
            }
          };
          
          window.loadFullScan = function() {
            const textarea = document.getElementById('starterPrompt');
            if (textarea) {
              textarea.value = 'scan app and do not change anithing';
              textarea.focus();
            }
          };
          
          window.injectPrompt = function() {
            const target = document.getElementById('starterPrompt');
            if (target && target.value.trim()) {
              const event = new Event('input', { bubbles: true });
              target.dispatchEvent(event);
            }
          };
          
          window.toggleDevTools = function() {
            console.log('DevTools tab clicked');
          };
          
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