// This script is responsible for injecting the React app into the page.

(function() {
  'use strict';

  const LOOPER_ROOT_ID = 'looper-root';

  // Check if the app is already injected
  if (document.getElementById(LOOPER_ROOT_ID)) {
    console.log('Looper is already active.');
    // Optional: Toggle visibility or remove/re-inject
    const root = document.getElementById(LOOPER_ROOT_ID);
    if (root) {
        root.style.display = root.style.display === 'none' ? 'block' : 'none';
    }
    return;
  }

  // 1. Create the root div for the React app
  const root = document.createElement('div');
  root.id = LOOPER_ROOT_ID;
  root.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    pointer-events: none;
    background: transparent;
  `;
  document.body.appendChild(root);
  
  // Make sure child elements can be clicked
  root.addEventListener('click', (e) => e.stopPropagation());


  // 2. Inject the app's CSS
  const cssUrl = chrome.runtime.getURL('dist/main.css');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  document.head.appendChild(link);

  // 3. Inject the app's JavaScript bundle
  const scriptUrl = chrome.runtime.getURL('dist/main.js');
  const script = document.createElement('script');
  script.type = 'module';
  script.src = scriptUrl;
  document.head.appendChild(script);

})();
