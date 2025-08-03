// This script runs when the browser action popup is clicked.

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('togglePanel');
  let isPanelVisible = false;

  // Function to inject the content script and CSS
  function injectContent(tabId) {
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['content-styles.css']
    });
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content-script.js']
    });
  }

  // Function to inject the React application
  function injectReactApp(tabId) {
    // The main.js is the output from Vite build of the 'Looper' project.
    // This assumes the 'Looper/dist/assets/main.js' is available.
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['main.js'] // This should point to the bundled JS from the Vite project
    });
  }
  
  // When the popup button is clicked
  toggleButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      
      // Prevent injection on special browser pages
      if (tabs[0].url && tabs[0].url.startsWith('chrome://')) {
        alert('Cannot run on chrome:// pages');
        return;
      }

      if (!isPanelVisible) {
        // First, ensure the content script has created the root div
        injectContent(tabId);
        
        // Now, inject the React app. We might need a small delay
        // to ensure the root element is ready.
        setTimeout(() => {
          injectReactApp(tabId);
          isPanelVisible = true;
          toggleButton.textContent = "Hide Looper Panel";
        }, 100);

      } else {
        // Reload the page to "remove" the panel.
        // A more sophisticated approach would be to unmount the React app.
        chrome.tabs.reload(tabId);
        window.close();
      }
    });
  });

});
