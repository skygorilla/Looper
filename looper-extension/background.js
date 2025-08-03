// Background script for Looper extension - Direct Component Injection
chrome.action.onClicked.addListener((tab) => {
  // Check if it's a chrome:// URL and skip
  if (tab.url && tab.url.startsWith('chrome://')) {
    return;
  }
  
  // Inject the actual LooperAutopilotAdvanced component directly
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-script.js']
  });
});