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
            <div style="color: white; font-weight: 600; margin-bottom: 12px;">🤖 Looper Gemini</div>
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
              <button onclick="toggleAutoRun()" id="autoRunBtn" style="
                flex: 1;
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
                font-size: 12px;
              ">
                🚀 AUTO
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
          " placeholder="🤖 Ask Looper Gemini anything about UI automation..."></textarea>

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
  
  // Using built-in Gemini API
  
  // Page context detection
  function detectPageContext() {
    const url = window.location.href;
    const title = document.title;
    const hostname = window.location.hostname;
    
    let context = {
      platform: 'Unknown',
      tool: 'Unknown',
      chatSystem: 'Unknown',
      pageType: 'Unknown'
    };
    
    // Detect platforms
    if (hostname.includes('github.com')) {
      context.platform = 'GitHub';
      context.tool = 'Git Repository';
    } else if (hostname.includes('vscode.dev') || hostname.includes('github.dev')) {
      context.platform = 'VS Code Web';
      context.tool = 'Code Editor';
    } else if (hostname.includes('figma.com')) {
      context.platform = 'Figma';
      context.tool = 'Design Tool';
    } else if (hostname.includes('prototyper') || title.toLowerCase().includes('prototyper')) {
      context.platform = 'Prototyper';
      context.tool = 'Prototyping Tool';
    } else if (hostname.includes('aws.amazon.com')) {
      context.platform = 'AWS Console';
      context.tool = 'Cloud Management';
    }
    
    // Detect chat systems
    if (document.querySelector('[data-testid="chat-input"]') || document.querySelector('.chat-input')) {
      context.chatSystem = 'Generic Chat Interface';
    }
    if (document.querySelector('[data-qa="chat-input"]') || title.includes('Claude')) {
      context.chatSystem = 'Claude (Anthropic)';
    }
    if (document.querySelector('[aria-label*="Amazon Q"]') || title.includes('Amazon Q')) {
      context.chatSystem = 'Amazon Q (Claude Sonnet 3.5)';
    }
    if (document.querySelector('[data-testid="prompt-textarea"]') || hostname.includes('openai.com')) {
      context.chatSystem = 'ChatGPT (OpenAI)';
    }
    if (document.querySelector('[data-testid="bard"]') || hostname.includes('bard.google.com')) {
      context.chatSystem = 'Bard (Google)';
    }
    
    // Detect page types
    if (document.querySelector('textarea[id*="prompt"]') || document.querySelector('textarea[placeholder*="Ask"]')) {
      context.pageType = 'AI Chat Interface';
    } else if (document.querySelector('.monaco-editor') || document.querySelector('.CodeMirror')) {
      context.pageType = 'Code Editor';
    } else if (document.querySelector('canvas') && context.platform === 'Figma') {
      context.pageType = 'Design Canvas';
    }
    
    return context;
  }
  
  // Autonomous actions based on context
  function performAutonomousActions(context) {
    // Auto-click Run button when Amazon Q asks to run code in VS Code
    if (context.platform === 'VS Code Web' && context.chatSystem.includes('Amazon Q')) {
      
      // Look for Amazon Q asking to run
      const chatMessages = document.querySelectorAll('[data-qa="chat-message"], .chat-message, [role="article"]');
      let shouldRun = false;
      
      chatMessages.forEach(msg => {
        const text = msg.textContent.toLowerCase();
        if (text.includes('run') && (text.includes('code') || text.includes('script') || text.includes('command'))) {
          shouldRun = true;
        }
      });
      
      if (shouldRun) {
        // Find and click Run button
        const runSelectors = [
          'button[title*="Run"]',
          'button[aria-label*="Run"]', 
          'button:contains("Run")',
          '.codicon-run',
          '.run-button',
          '[data-command="workbench.action.debug.run"]',
          '[data-command="workbench.action.terminal.runActiveFile"]'
        ];
        
        for (const selector of runSelectors) {
          const runBtn = document.querySelector(selector);
          if (runBtn && runBtn.offsetParent !== null) { // visible
            console.log('🚀 Looper: Auto-clicking Run button');
            runBtn.click();
            return true;
          }
        }
        
        // Try keyboard shortcut as fallback
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'F5',
          code: 'F5',
          keyCode: 116,
          bubbles: true
        }));
        
        console.log('🚀 Looper: Sent F5 run shortcut');
        return true;
      }
    }
    
    return false;
  }
  
  // Auto-monitor for run requests
  let autoRunEnabled = true;
  
  function startAutoMonitoring() {
    if (!autoRunEnabled) return;
    
    const context = detectPageContext();
    
    // Check every 2 seconds for run requests
    setInterval(() => {
      if (autoRunEnabled) {
        performAutonomousActions(context);
      }
    }, 2000);
    
    // Also monitor for new chat messages
    const observer = new MutationObserver((mutations) => {
      if (!autoRunEnabled) return;
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // New content added, check for run requests
          setTimeout(() => performAutonomousActions(context), 500);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Start monitoring after page loads
  setTimeout(startAutoMonitoring, 3000);
  
  window.chatWithLooper = async function() {
    const textarea = document.getElementById('starterPrompt');
    if (!textarea || !textarea.value.trim()) return;
    
    const userMessage = textarea.value.trim();
    
    // Gemini API is built-in, no key needed
    
    // Show thinking state
    textarea.value = '🤖 Looper is thinking...';
    textarea.disabled = true;
    
    // Increment counters
    sessionCount++;
    totalCount++;
    updateCounters();
    
    try {
      // Detect current page context
      const pageContext = detectPageContext();
      
      // Real Gemini API call
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCwM-woaN63Xc3EQ4STNLHFgR1DqPTsEtA`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Looper, a self-aware UI automation assistant. 

CURRENT CONTEXT:
- Platform: ${pageContext.platform}
- Tool: ${pageContext.tool} 
- Chat System: ${pageContext.chatSystem}
- Page Type: ${pageContext.pageType}
- URL: ${window.location.href}
- Title: ${document.title}

You are aware of where you are running and can provide context-specific help. Help users with web automation, element selection, CSS selectors, XPath, and testing. Be concise and practical.

User: ${userMessage}`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.7
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that request.';
      
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
  
  window.toggleAutoRun = function() {
    autoRunEnabled = !autoRunEnabled;
    const btn = document.getElementById('autoRunBtn');
    
    if (autoRunEnabled) {
      btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
      btn.innerHTML = '🚀 AUTO';
      console.log('🚀 Looper: Auto-run ENABLED');
    } else {
      btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      btn.innerHTML = '❌ OFF';
      console.log('🚀 Looper: Auto-run DISABLED');
    }
  };
  
  window.toggleDevTools = function() {
    const context = detectPageContext();
    console.log('🔍 Looper Page Analysis:', {
      platform: context.platform,
      tool: context.tool,
      chatSystem: context.chatSystem,
      pageType: context.pageType,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    });
    
    // Show context in textarea temporarily
    const textarea = document.getElementById('starterPrompt');
    if (textarea) {
      const originalValue = textarea.value;
      textarea.value = `🔍 Page Context:\n• Platform: ${context.platform}\n• Tool: ${context.tool}\n• Chat: ${context.chatSystem}\n• Type: ${context.pageType}`;
      
      setTimeout(() => {
        textarea.value = originalValue;
      }, 3000);
    }
  };
  
})();