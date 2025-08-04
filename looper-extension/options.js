// Options page script
document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');
  
  // Load saved API key
  chrome.storage.local.get(['openai-api-key'], function(result) {
    if (result['openai-api-key']) {
      apiKeyInput.value = result['openai-api-key'];
    }
  });
  
  // Save API key
  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key', false);
      return;
    }
    
    if (!apiKey.startsWith('sk-')) {
      showStatus('Invalid API key format', false);
      return;
    }
    
    chrome.storage.local.set({'openai-api-key': apiKey}, function() {
      showStatus('API key saved successfully!', true);
    });
  });
  
  function showStatus(message, isSuccess) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${isSuccess ? 'success' : 'error'}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});