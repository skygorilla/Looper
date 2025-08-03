// Background script for Looper extension
chrome.action.onClicked.addListener((tab) => {
  // Check if it's a chrome:// URL and skip
  if (tab.url && tab.url.startsWith('chrome://')) {
    return;
  }
  
  // Inject the actual LooperAutopilotAdvanced component from Firebase project
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function() {
      // Remove existing panel if any
      const existing = document.getElementById('looper-extension-root');
      if (existing) {
        existing.remove();
        return;
      }
      
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
        pointer-events: auto;
      `;
      
      // Add close button overlay
      iframe.onload = function() {
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
    }
  });
});