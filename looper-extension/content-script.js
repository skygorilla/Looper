// Content script - Inject Looper with AI chat
(function() {
  'use strict';
  
  // Remove existing panel if any
  const existing = document.getElementById('looper-extension-root');
  if (existing) {
    existing.remove();
    return;
  }
  
  // Create root container
  const rootContainer = document.createElement('div');
  rootContainer.id = 'looper-extension-root';
  rootContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  // Inject the Looper interface with AI chat
  rootContainer.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%; pointer-events: none;">
      <div style="
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
      ">
        <!-- Left Tabs -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div onclick="toggleDevTools()" style="
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
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
              <polyline points="4,17 10,11 4,5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
          </div>
        </div>

        <!-- Central Panel -->
        <div style="
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
        ">
          <!-- Close Button -->
          <button onclick="document.getElementById('looper-extension-root').remove()" style="
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
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Header -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="color: white; font-weight: 600; margin-bottom: 12px;">🤖 Looper AI</div>
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Ready to Chat</div>
          </div>

          <!-- Stats -->
          <div style="
            background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: inset 14px 14px 40px rgba(16,16,18,0.75), inset -7px -7px 30px #262E32;
          ">
            <div style="display: flex; justify-content: space-around; align-items: center;">
              <div style="text-align: center;">
                <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Chats</div>
                <div id="session-count" style="font-size: 24px; font-weight: 600; color: white;">0</div>
              </div>
              <div style="width: 2px; height: 32px; background: linear-gradient(to bottom, #16171B 0%, #353A40 100%); border-radius: 2px;"></div>
              <div style="text-align: center;">
                <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Total</div>
                <div id="total-count" style="font-size: 24px; font-weight: 600; color: white;">0</div>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 10px; margin-bottom: 12px;">
              <button onclick="startLooper()" style="
                flex: 1;
                height: 56px;
                border-radius: 16px;
                background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
                box-shadow: 10px 15px 40px #000000, -10px -15px 40px #2F393D;
                border: none;
                color: #3b82f6;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
              </button>
              <button onclick="clearChat()" style="
                flex: 1;
                height: 56px;
                border-radius: 16px;
                background: linear-gradient(135deg, #1F2328 0%, #1A1C1F 100%);
                box-shadow: 10px 15px 40px #000000, -10px -15px 40px #2F393D;
                border: none;
                color: #f59e0b;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Chat Textarea -->
          <textarea id="starterPrompt" style="
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
          " placeholder="🤖 Ask Looper AI anything about UI automation..."></textarea>

          <!-- Chat Button -->
          <button onclick="chatWithLooper()" style="
            width: 100%;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            box-shadow: 10px 15px 40px #000000, -10px -15px 40px #2F393D;
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            margin-bottom: 20px;
            font-weight: 600;
          ">
            💬 Chat with Looper
          </button>

          <!-- Footer -->
          <div style="text-align: center; font-size: 12px; color: #6b7280; margin-top: auto;">
            Looper AI Assistant
          </div>
        </div>

        <!-- Right Tabs -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div onclick="loadFullScan()" style="
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
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(rootContainer);
  
  // Add functionality
  let sessionCount = 0;
  let totalCount = 0;
  
  // Load total count from chrome storage
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['looper-total-count'], function(result) {
      totalCount = result['looper-total-count'] || 0;
      updateCounters();
    });
  }
  
  // Update counters
  function updateCounters() {
    const sessionEl = document.getElementById('session-count');
    const totalEl = document.getElementById('total-count');
    if (sessionEl) sessionEl.textContent = sessionCount;
    if (totalEl) totalEl.textContent = totalCount;
  }
  
  updateCounters();
  
  window.startLooper = function() {
    const textarea = document.getElementById('starterPrompt');
    if (textarea) {
      textarea.value = 'scan app and do not change anithing';
      textarea.focus();
      
      sessionCount++;
      totalCount++;
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({'looper-total-count': totalCount});
      }
      
      updateCounters();
    }
  };
  
  window.loadFullScan = function() {
    const textarea = document.getElementById('starterPrompt');
    if (textarea) {
      textarea.value = 'scan app and do not change anithing';
      textarea.focus();
    }
  };
  
  window.clearChat = function() {
    const textarea = document.getElementById('starterPrompt');
    if (textarea) {
      textarea.value = '';
      textarea.placeholder = '🤖 Ask Looper AI anything about UI automation...';
    }
  };
  
  window.chatWithLooper = async function() {
    const textarea = document.getElementById('starterPrompt');
    if (!textarea || !textarea.value.trim()) return;
    
    const userMessage = textarea.value.trim();
    
    // Show thinking state
    textarea.value = '🤖 Looper is thinking...';
    textarea.disabled = true;
    
    // Increment counters
    sessionCount++;
    totalCount++;
    updateCounters();
    
    try {
      // Simulate AI response (replace with real API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        "I can help you automate UI tasks! Try using the scan function to analyze the current page.",
        "For UI automation, I recommend starting with element identification. What specific task do you need help with?",
        "I'm here to assist with web automation. You can use me to extract UI elements, audit accessibility, or analyze components.",
        "Let me help you with that! I can scan pages, extract elements, and provide automation guidance.",
        "Great question! For UI automation, I suggest using CSS selectors or XPath to target elements reliably."
      ];
      
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Show AI response
      textarea.value = `🤖 Looper: ${aiResponse}`;
      
      // Auto-clear after 5 seconds
      setTimeout(() => {
        textarea.value = '';
        textarea.placeholder = '🤖 Ask Looper AI anything about UI automation...';
      }, 5000);
      
    } catch (error) {
      textarea.value = '🤖 Looper: Sorry, I\\'m having trouble right now. Please try again.';
      setTimeout(() => {
        textarea.value = userMessage;
      }, 3000);
    } finally {
      textarea.disabled = false;
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({'looper-total-count': totalCount});
      }
    }
  };
  
  window.toggleDevTools = function() {
    console.log('DevTools tab clicked');
  };
  
})();