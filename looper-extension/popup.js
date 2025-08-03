// Popup script for UI Automation Toolkit
document.addEventListener('DOMContentLoaded', function() {
  const togglePanelBtn = document.getElementById('togglePanel');
  const refreshPageBtn = document.getElementById('refreshPage');
  const panelStatusEl = document.getElementById('panelStatus');
  const targetStatusEl = document.getElementById('targetStatus');

  // Update status on popup open
  updateStatus();

  // Toggle panel button
  togglePanelBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePanel' }, function(response) {
        if (response && response.status === 'success') {
          panelStatusEl.textContent = response.injected ? 'Active' : 'Inactive';
          togglePanelBtn.textContent = response.injected ? 'Hide Automation Panel' : 'Show Automation Panel';
        }
      });
    });
  });

  // Refresh page button
  refreshPageBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    });
  });

  // Update status function
  function updateStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // Check if content script is loaded and panel is active
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, function(response) {
        if (chrome.runtime.lastError) {
          panelStatusEl.textContent = 'Not Loaded';
          targetStatusEl.textContent = 'Unknown';
        } else if (response) {
          panelStatusEl.textContent = response.panelActive ? 'Active' : 'Inactive';
          targetStatusEl.textContent = response.targetFound ? 'Found' : 'Not Found';
          togglePanelBtn.textContent = response.panelActive ? 'Hide Automation Panel' : 'Show Automation Panel';
        }
      });

      // Check if we can inject the content script
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: function() {
          return {
            hasStarterPrompt: !!document.getElementById('starterPrompt'),
            url: window.location.href
          };
        }
      }, function(results) {
        if (results && results[0] && results[0].result) {
          const result = results[0].result;
          targetStatusEl.textContent = result.hasStarterPrompt ? 'Found' : 'Not Found';
        }
      });
    });
  }

  // Update status every 2 seconds
  setInterval(updateStatus, 2000);
});