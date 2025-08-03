// This script is responsible for creating the root element
// into which the React application will be rendered.

(function() {
  'use strict';

  // Check if the root element already exists
  if (document.getElementById('looper-extension-root')) {
    return;
  }

  // Create the root element for the React app
  const root = document.createElement('div');
  root.id = 'looper-extension-root';
  document.body.appendChild(root);
  console.log("Looper extension root created.");

})();
