// Popup script for UI Automation Toolkit
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
      
      // Force inject panel directly
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: function() {
          // Remove existing panel if any
          const existing = document.getElementById('ui-automation-extension-root');
          if (existing) existing.remove();
          
          // Inject panel directly
          const panelContainer = document.createElement('div');
          panelContainer.id = 'ui-automation-extension-root';
          panelContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            width: 420px;
            height: 420px;
            pointer-events: none;
          `;
          
          panelContainer.innerHTML = `
            <div style="width: 100%; height: 100%; pointer-events: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; padding: 20px; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <h3 style="margin: 0 0 16px 0; color: #3b82f6; text-align: center;">🔄 Looper Autopilot</h3>
                <div style="text-align: center; margin-bottom: 16px;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                      <polyline points="16,18 22,12 16,6"></polyline>
                      <polyline points="8,6 2,12 8,18"></polyline>
                    </svg>
                  </div>
                </div>
                <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 12px; color: #9ca3af;">Status:</span>
                    <span style="font-size: 12px; color: #22c55e;">Active</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 12px; color: #9ca3af;">Target:</span>
                    <span style="font-size: 12px; color: #3b82f6;" id="target-status">Checking...</span>
                  </div>
                </div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="width: 100%; padding: 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 8px;">Close Panel</button>
                <button onclick="injectUIPrompt()" style="width: 100%; padding: 8px; background: #22c55e; color: white; border: none; border-radius: 4px; cursor: pointer;">Extract UI Elements</button>
              </div>
            </div>
          `;
          
          document.body.appendChild(panelContainer);
          
          // Add the inject function
          window.injectUIPrompt = function() {
            const target = document.getElementById('starterPrompt');
            if (target) {
              target.value = 'Please analyze the current webpage and extract all interactive UI elements. Create a comprehensive list of all buttons, form inputs, links, and clickable elements with their properties.';
              target.focus();
              const event = new Event('input', { bubbles: true });
              target.dispatchEvent(event);
              
              // Update status
              const statusEl = document.getElementById('target-status');
              if (statusEl) statusEl.textContent = 'Prompt Injected';
            } else {
              alert('Target textarea "starterPrompt" not found on this page.');
            }
          };
          
          // Check target status
          const checkTarget = () => {
            const statusEl = document.getElementById('target-status');
            const target = document.getElementById('starterPrompt');
            if (statusEl) {
              statusEl.textContent = target ? 'Found' : 'Not Found';
              statusEl.style.color = target ? '#22c55e' : '#f59e0b';
            }
          };
          
          checkTarget();
          setInterval(checkTarget, 2000);
          
          return { success: true, injected: true };
        }
      }, function(results) {
        if (results && results[0] && results[0].result) {
          panelStatusEl.textContent = 'Active';
          togglePanelBtn.textContent = 'Hide Panel';
        }
      });
    });
  }
});