// This is the background service worker.
// It will be responsible for handling events when the extension is installed, updated, or the browser starts.
// For now, it's a placeholder.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Looper extension installed.");
});
