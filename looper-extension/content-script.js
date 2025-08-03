// Content script for UI Automation Toolkit
(function() {
  'use strict';

  let panelInjected = false;
  let panelContainer = null;

  // Inject the automation panel into the page
  function injectPanel() {
    if (panelInjected) return;

    // Create container for the panel
    panelContainer = document.createElement('div');
    panelContainer.id = 'ui-automation-extension-root';
    panelContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      width: 420px;
      height: 420px;
      pointer-events: none;
    `;

    // Create panel content
    const panelContent = document.createElement('div');
    panelContent.innerHTML = `
      <div id="automation-panel-container" style="
        width: 100%;
        height: 100%;
        pointer-events: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div class="automation-panel-root"></div>
      </div>
    `;

    panelContainer.appendChild(panelContent);
    document.body.appendChild(panelContainer);

    // Initialize the React panel
    initializePanel();
    
    panelInjected = true;
    console.log('UI Automation Panel injected successfully');
  }

  // Initialize the React automation panel
  function initializePanel() {
    const container = document.getElementById('automation-panel-container');
    if (!container) return;

    // Create the circular automation panel
    container.innerHTML = `
      <div class="ui-automation-panel-ext">
        <!-- Main Circular Panel -->
        <div class="circular-container">
          <!-- Round tabs positioned around circle -->
          <div class="round-tab tab-extract" data-tab="extract" style="left: calc(50% + 127px - 2rem); top: calc(50% - 127px - 2rem);">
            <button class="main-tab-btn active">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16,18 22,12 16,6"></polyline>
                <polyline points="8,6 2,12 8,18"></polyline>
              </svg>
            </button>
            <div class="sub-tabs hidden">
              <button class="sub-tab-btn" style="left: calc(50% + 28px - 1rem); top: calc(50% - 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% + 40px - 1rem); top: calc(50% + 0px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% + 28px - 1rem); top: calc(50% + 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
            </div>
            <div class="tab-label">Extract UI</div>
          </div>

          <div class="round-tab tab-audit" data-tab="audit" style="left: calc(50% + 127px - 2rem); top: calc(50% + 127px - 2rem);">
            <button class="main-tab-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </button>
            <div class="sub-tabs hidden">
              <button class="sub-tab-btn" style="left: calc(50% + 28px - 1rem); top: calc(50% - 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% + 40px - 1rem); top: calc(50% + 0px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% + 28px - 1rem); top: calc(50% + 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
            </div>
            <div class="tab-label">Audit UI</div>
          </div>

          <div class="round-tab tab-components" data-tab="components" style="left: calc(50% - 127px - 2rem); top: calc(50% + 127px - 2rem);">
            <button class="main-tab-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"></polygon>
                <line x1="12" y1="22" x2="12" y2="15.5"></line>
                <polyline points="22,8.5 12,15.5 2,8.5"></polyline>
              </svg>
            </button>
            <div class="sub-tabs hidden">
              <button class="sub-tab-btn" style="left: calc(50% - 28px - 1rem); top: calc(50% + 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% - 40px - 1rem); top: calc(50% + 0px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% - 28px - 1rem); top: calc(50% - 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
            </div>
            <div class="tab-label">Components</div>
          </div>

          <div class="round-tab tab-performance" data-tab="performance" style="left: calc(50% - 127px - 2rem); top: calc(50% - 127px - 2rem);">
            <button class="main-tab-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m12 14 4-4"></path>
                <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
              </svg>
            </button>
            <div class="sub-tabs hidden">
              <button class="sub-tab-btn" style="left: calc(50% - 28px - 1rem); top: calc(50% - 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% - 40px - 1rem); top: calc(50% + 0px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
              <button class="sub-tab-btn" style="left: calc(50% - 28px - 1rem); top: calc(50% + 28px - 1rem);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle></svg></button>
            </div>
            <div class="tab-label">Performance</div>
          </div>

          <!-- Central LCD Panel -->
          <div class="lcd-panel">
            <div class="lcd-header">
              <div class="status-indicator">
                <div class="status-dot"></div>
                <span class="status-text">READY</span>
              </div>
              <div class="mode-badge">IDLE</div>
            </div>
            
            <div class="lcd-content">
              <div>SYSTEM: UI AUTOMATION</div>
              <div id="mode-display">MODE: EXTRACT UI</div>
              <div id="status-display">STATUS: READY</div>
              <div class="separator"></div>
              <div>TABS: 4</div>
              <div id="active-display">ACTIVE: EXTRACT</div>
              <div id="expanded-display"></div>
            </div>
            
            <div class="control-buttons">
              <button class="control-btn play-stop-btn" id="playStopBtn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
              </button>
              <button class="control-btn power-btn" id="powerBtn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Content Panel -->
        <div class="content-panel hidden" id="contentPanel">
          <div class="content-header">
            <h3 id="contentTitle">Extract UI Commands</h3>
            <button class="close-btn" id="closeContent">×</button>
          </div>
          <div class="content-body" id="contentBody">
            <p>Click the action button below to inject the UI extraction prompt into the target textarea.</p>
            <button class="action-btn" id="actionBtn">Extract UI Elements</button>
            <div class="target-status" id="targetStatus">
              <span class="target-dot"></span>
              <span>Target: Checking...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize the automation logic
    initializeAutomationLogic();
  }

  // Initialize automation logic and event handlers
  function initializeAutomationLogic() {
    let activeTab = 'extract';
    let expandedTab = null;
    let isRunning = false;
    let targetFound = false;

    // Tab configurations
    const tabConfigs = {
      extract: {
        title: 'Extract UI Commands',
        prompt: `Please analyze the current webpage and extract all interactive UI elements. Create a comprehensive list of:

1. All buttons (with their text, IDs, classes, and onclick handlers)
2. All form inputs (type, name, placeholder, validation)
3. All links (href, text content, target)
4. All clickable elements (divs, spans with click handlers)
5. All form elements (forms, selects, textareas)

Format the output as structured HTML and save it as elements.html with proper categorization and accessibility information.`,
        action: 'Extract UI Elements'
      },
      audit: {
        title: 'Audit UI Commands',
        prompt: `Please perform a comprehensive accessibility and usability audit of this webpage focusing on:

1. WCAG 2.1 compliance (A, AA, AAA levels)
2. Keyboard navigation and focus management
3. Screen reader compatibility and ARIA labels
4. Color contrast ratios and visual accessibility
5. Form validation and error handling
6. Interactive element accessibility
7. Semantic HTML structure
8. Mobile responsiveness and touch targets

Provide specific recommendations for each issue found with code examples for fixes.`,
        action: 'Run Accessibility Audit'
      },
      components: {
        title: 'Component Analysis',
        prompt: `Please analyze the UI components on this page and suggest improvements:

1. Identify reusable UI patterns and components
2. Suggest component architecture improvements
3. Analyze component coupling and cohesion
4. Recommend design system patterns
5. Identify opportunities for component abstraction
6. Suggest naming conventions and organization
7. Analyze state management patterns
8. Recommend performance optimizations for components

Provide a detailed component hierarchy and refactoring suggestions.`,
        action: 'Analyze Components'
      },
      performance: {
        title: 'Performance Analysis',
        prompt: `Please analyze the UI performance of this webpage:

1. Identify performance bottlenecks in rendering
2. Analyze bundle size and loading performance
3. Check for memory leaks and optimization opportunities
4. Evaluate image optimization and lazy loading
5. Analyze CSS and JavaScript efficiency
6. Check for unused code and dependencies
7. Evaluate Core Web Vitals metrics
8. Suggest performance improvement strategies

Provide specific optimization recommendations with implementation details.`,
        action: 'Run Performance Analysis'
      }
    };

    // Check for target textarea
    function checkTarget() {
      const target = document.getElementById('starterPrompt');
      const wasFound = targetFound;
      targetFound = !!target;
      
      if (wasFound !== targetFound) {
        updateTargetStatus();
        updateLCDStatus();
      }
    }

    // Update target status display
    function updateTargetStatus() {
      const statusEl = document.getElementById('targetStatus');
      const statusDot = document.querySelector('.target-dot');
      const statusText = statusEl.querySelector('span:last-child');
      
      if (targetFound) {
        statusDot.style.backgroundColor = '#22c55e';
        statusText.textContent = 'Target: starterPrompt found';
      } else {
        statusDot.style.backgroundColor = '#f59e0b';
        statusText.textContent = 'Target: starterPrompt missing';
      }
    }

    // Update LCD display
    function updateLCDStatus() {
      const statusDisplay = document.getElementById('status-display');
      const statusDot = document.querySelector('.status-dot');
      const statusText = document.querySelector('.status-text');
      
      if (targetFound) {
        statusDisplay.textContent = 'STATUS: READY';
        statusDot.style.backgroundColor = '#22c55e';
        statusText.textContent = 'READY';
      } else {
        statusDisplay.textContent = 'STATUS: WAIT';
        statusDot.style.backgroundColor = '#f59e0b';
        statusText.textContent = 'WAIT';
      }
    }

    // Handle tab clicks
    document.querySelectorAll('.round-tab').forEach(tab => {
      const mainBtn = tab.querySelector('.main-tab-btn');
      const subTabs = tab.querySelector('.sub-tabs');
      const tabId = tab.dataset.tab;

      mainBtn.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.main-tab-btn').forEach(btn => btn.classList.remove('active'));
        mainBtn.classList.add('active');
        
        activeTab = tabId;
        
        // Toggle expansion
        if (expandedTab === tabId) {
          expandedTab = null;
          subTabs.classList.add('hidden');
          document.getElementById('contentPanel').classList.add('hidden');
        } else {
          // Hide other expanded tabs
          document.querySelectorAll('.sub-tabs').forEach(st => st.classList.add('hidden'));
          
          expandedTab = tabId;
          subTabs.classList.remove('hidden');
          showContentPanel(tabId);
        }
        
        // Update LCD
        const modeDisplay = document.getElementById('mode-display');
        const activeDisplay = document.getElementById('active-display');
        const expandedDisplay = document.getElementById('expanded-display');
        
        modeDisplay.textContent = `MODE: ${tabConfigs[tabId].title.toUpperCase()}`;
        activeDisplay.textContent = `ACTIVE: ${tabId.toUpperCase()}`;
        expandedDisplay.textContent = expandedTab ? `EXPANDED: ${expandedTab.toUpperCase()}` : '';
      });
    });

    // Show content panel
    function showContentPanel(tabId) {
      const contentPanel = document.getElementById('contentPanel');
      const contentTitle = document.getElementById('contentTitle');
      const actionBtn = document.getElementById('actionBtn');
      
      contentTitle.textContent = tabConfigs[tabId].title;
      actionBtn.textContent = tabConfigs[tabId].action;
      actionBtn.onclick = () => injectPrompt(tabConfigs[tabId].prompt);
      
      contentPanel.classList.remove('hidden');
    }

    // Inject prompt into target textarea
    function injectPrompt(prompt) {
      const target = document.getElementById('starterPrompt');
      if (target) {
        target.value = prompt;
        target.focus();
        
        // Trigger input event
        const event = new Event('input', { bubbles: true });
        target.dispatchEvent(event);
        
        console.log('Prompt injected successfully');
      } else {
        alert('Target textarea "starterPrompt" not found on this page.');
      }
    }

    // Handle control buttons
    document.getElementById('playStopBtn').addEventListener('click', () => {
      isRunning = !isRunning;
      const btn = document.getElementById('playStopBtn');
      const modeBadge = document.querySelector('.mode-badge');
      
      if (isRunning) {
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        modeBadge.textContent = 'RUNNING';
        btn.style.backgroundColor = '#ef4444';
      } else {
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5,3 19,12 5,21"></polygon></svg>';
        modeBadge.textContent = 'IDLE';
        btn.style.backgroundColor = '#22c55e';
      }
    });

    document.getElementById('powerBtn').addEventListener('click', () => {
      if (panelContainer) {
        panelContainer.style.display = panelContainer.style.display === 'none' ? 'block' : 'none';
      }
    });

    document.getElementById('closeContent').addEventListener('click', () => {
      document.getElementById('contentPanel').classList.add('hidden');
      expandedTab = null;
      document.querySelectorAll('.sub-tabs').forEach(st => st.classList.add('hidden'));
      document.getElementById('expanded-display').textContent = '';
    });

    // Start target checking
    checkTarget();
    setInterval(checkTarget, 2000);
  }

  // Remove panel
  function removePanel() {
    if (panelContainer && panelContainer.parentNode) {
      panelContainer.parentNode.removeChild(panelContainer);
      panelInjected = false;
      panelContainer = null;
    }
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'togglePanel') {
      if (panelInjected) {
        removePanel();
      } else {
        injectPanel();
      }
      sendResponse({ status: 'success', injected: panelInjected });
    }
  });

  // Auto-inject on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPanel);
  } else {
    injectPanel();
  }

})();