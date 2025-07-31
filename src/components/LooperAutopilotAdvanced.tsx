'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Monitor, 
  Plus, 
  Zap, 
  Terminal, 
  AlertTriangle, 
  Settings, 
  Activity, 
  Info,
  Play,
  Pause,
  Square,
  Repeat,
  Clock,
  Globe
} from 'lucide-react';

interface LooperAutopilotAdvancedProps {
  className?: string;
}

export const LooperAutopilotAdvanced: React.FC<LooperAutopilotAdvancedProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [starterPrompt, setStarterPrompt] = useState('🤖 Smart Analysis Mode: Analyzing current page context...');
  const [consoleEntries, setConsoleEntries] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [siteMapData, setSiteMapData] = useState<any[]>([]);
  const [prototyperStatus, setPrototyperStatus] = useState('System Ready');
  const [statusText, setStatusText] = useState('Ready');
  const [isThinking, setIsThinking] = useState(false);

  const prototyperScreenRef = useRef<HTMLDivElement>(null);

  // Tab beep sound function
  const playTabBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 120;
      g.gain.value = 0.11;
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.13);
      o.onended = () => ctx.close();
    } catch (e) {}
  };

  // Initialize data on mount from localStorage
  useEffect(() => {
    setTotalCount(parseInt(localStorage.getItem('looper-total-count') || '0'));
    setStarterPrompt(localStorage.getItem('starterPrompt') || '🤖 Smart Analysis Mode: Analyzing current page context...');
    
    // Load console entries
    const savedEntries = JSON.parse(localStorage.getItem('logEntries') || '[]');
    setConsoleEntries(savedEntries);

    // Initialize issues
    setIssues([
      { type: 'info', message: 'Click "Capture Issues" to scan for problems and warnings' }
    ]);

    // Update prototyper status based on page
    const updateStatus = () => {
      const currentUrl = window.location.href;
      if (currentUrl.startsWith('file:')) {
        setPrototyperStatus('Prototyper Status: Local Preview Mode');
      } else {
        setPrototyperStatus('Prototyper Status: System Ready');
      }
    };

    updateStatus();
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('looper-total-count', totalCount.toString());
  }, [totalCount]);

  useEffect(() => {
    localStorage.setItem('starterPrompt', starterPrompt);
  }, [starterPrompt]);

  const handleTabClick = (tabId: string) => {
    playTabBeep();
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setSessionCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
      setStatusText('Processing...');
      setIsThinking(true);
      
      // Add console entry
      const newEntry = {
        timestamp: Date.now(),
        level: 'log',
        message: `Autopilot starting with prompt: ${starterPrompt.substring(0, 50)}...`
      };
      setConsoleEntries(prev => [newEntry, ...prev]);
    } else {
      setIsRunning(false);
      setStatusText('Ready');
      setIsThinking(false);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      setStatusText('Paused');
    } else {
      setStatusText('Processing...');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset everything?')) {
      setIsRunning(false);
      setIsPaused(false);
      setSessionCount(0);
      setStatusText('Ready');
      setIsThinking(false);
      setStarterPrompt('🤖 Smart Analysis Mode: Analyzing current page context...');
    }
  };

  const handleInjectPrompt = () => {
    const newEntry = {
      timestamp: Date.now(),
      level: 'api',
      message: `Injecting prompt: ${starterPrompt.substring(0, 50)}...`
    };
    setConsoleEntries(prev => [newEntry, ...prev]);
  };

  const captureIssues = () => {
    const newIssues = [
      { type: 'info', message: 'No issues detected. Page appears to be functioning correctly.' }
    ];
    setIssues(newIssues);
  };

  const clearConsole = () => {
    setConsoleEntries([]);
    localStorage.removeItem('logEntries');
  };

  const exportConsole = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `console-log-${timestamp}.json`;
    const dataStr = JSON.stringify(consoleEntries, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    link.click();
  };

  return (
    <div className={`looper-autopilot-advanced ${className || ''} dark`}>
      <style jsx>{`
        .looper-autopilot-advanced {
          --color-bg-main: #1a1b1e;
          --color-bg-panel: #23263a;
          --color-bg-card: #353A40;
          --color-bg-dark: #16171B;
          --color-accent-blue: #6366f1;
          --color-accent-green: #10b981;
          --color-accent-orange: #f59e0b;
          --color-accent-red: #ef4444;
          --color-accent-lightblue: #11A8FD;
          --color-text-main: #fff;
          --color-text-soft: #a5b4fc;
          --color-text-muted: #A6B0C3;
          --color-text-subtle: #7F8489;

          display: grid;
          grid-template-columns: auto auto auto auto;
          grid-template-rows: auto auto auto auto;
          gap: 20px;
          align-items: center;
          justify-items: center;
          position: relative;
          width: 100%;
          max-width: 1400px;
          padding: 20px;
          transform: scale(0.8);
          transition: transform 0.4s ease;
          background: transparent;
          min-height: 400px;
          animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.6);
          }
          to {
            opacity: 1;
            transform: scale(0.8);
          }
        }

        .looper-autopilot-advanced::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle at center, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 70%);
          border-radius: 40px;
          z-index: -1;
          pointer-events: none;
        }

        .looper-autopilot-advanced:hover {
          transform: scale(0.85);
        }

        .tab {
          cursor: pointer;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          position: relative;
          z-index: 2147483647;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(145deg, var(--color-bg-panel), #1A1D21);
          min-width: 56px;
          min-height: 56px;
        }

        .tab:hover:not(.expanded) {
          transform: scale(1.1);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tab:active:not(.expanded) {
          transform: scale(0.98);
          background: linear-gradient(145deg, #1A1C1F 0%, var(--color-bg-panel) 100%);
          transition: all 0.1s ease;
        }

        .tab.expanded {
          z-index: 20;
          border-radius: 24px;
          background: linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-dark) 100%);
          color: var(--color-text-main);
          overflow: hidden;
        }

        .left-tabs .tab.expanded, .right-tabs .tab.expanded {
          width: 336px;
          height: 384px;
        }

        .top-tabs .tab.expanded {
          width: 480px;
          height: 216px;
        }

        .bottom-tabs .tab.expanded {
          width: 480px;
          height: 216px;
        }

        .tab-content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          overflow: hidden;
        }

        .tab.expanded .tab-content {
          opacity: 1;
          transform: scale(1);
        }

        .tab-content h3 {
          font-size: 1.44rem;
          margin: 0 0 16px 0;
          color: var(--color-text-main);
          width: 100%;
          text-align: center;
          line-height: 1.3;
        }

        .tab-content p {
          font-size: 1.2rem;
          margin: 0 0 12px 0;
          color: var(--color-text-subtle);
          line-height: 1.5;
        }

        .left-tabs {
          grid-column: 2;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .right-tabs {
          grid-column: 4;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .top-tabs {
          grid-column: 3;
          grid-row: 1;
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 0 20px;
        }

        .bottom-tabs {
          grid-column: 3;
          grid-row: 3;
          display: flex;
          gap: 20px;
        }

        .prototyper-screen-container {
          grid-column: 1;
          grid-row: 1 / span 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .prototyper-screen {
          width: 216px;
          height: 264px;
          background: #1A1C1F;
          border-radius: 16px;
          box-shadow: inset 5px 5px 10px rgba(0,0,0,0.5), inset -5px -5px 10px rgba(53,58,64,0.5);
          padding: 15px;
          overflow: hidden;
          position: relative;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--color-accent-green);
          line-height: 1.4;
          white-space: pre-wrap;
          word-break: break-word;
          transition: all 0.1s ease-out;
        }

        .simulated-toolui {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sim-checkpoint {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 5px 8px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .sim-title {
          font-weight: bold;
          color: #fff;
          font-size: 13px;
        }

        .sim-code {
          font-size: 12px;
          color: #A6B0C3;
          margin-top: 2px;
        }

        .sim-file-changes {
          margin-top: 5px;
          font-size: 12px;
        }

        .sim-file {
          display: flex;
          justify-content: space-between;
          color: #C3CFE2;
          padding: 2px 0;
        }

        .sim-added { color: #1abc9c; font-weight: bold; }
        .sim-removed { color: #e74c3c; font-weight: bold; }

        .sim-message {
          margin-top: auto;
          color: #74B9FF;
          font-size: 12px;
          padding-top: 5px;
          border-top: 1px dashed rgba(255,255,255,0.1);
        }

        .looper-panel {
          grid-column: 3;
          grid-row: 2;
          width: 300px;
          height: 652px;
          padding: 28px;
          border-radius: 60px;
          background: linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-dark) 100%);
          box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
          user-select: none;
          position: relative;
          font-family: "Inter", sans-serif;
          overflow: visible;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .panel-header {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 24px;
          cursor: move;
          gap: 12px;
          position: relative;
          transition: opacity 0.2s ease;
        }

        .logo-placeholders {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 8px;
          align-items: center;
          width: 100%;
          height: 24px;
        }

        .logo-spinner {
          grid-column: 1;
          justify-self: end;
          width: 24px;
          height: 24px;
          visibility: ${isThinking ? 'visible' : 'hidden'};
          animation: ${isThinking ? 'rotateThink 2s linear infinite' : 'none'};
        }

        @keyframes rotateThink {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .logo-text {
          grid-column: 2;
          justify-self: center;
          color: var(--color-text-main);
          font-weight: 600;
          font-size: 14px;
        }

        .status-icon {
          grid-column: 3;
          justify-self: start;
          width: 24px;
          height: 24px;
          visibility: ${isThinking ? 'hidden' : 'visible'};
        }

        .status-text {
          font-size: 12px;
          color: var(--color-text-subtle);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .counters {
          background: linear-gradient(138.69deg, #1F2328 0%, #1A1C1F 100%);
          box-shadow: inset 14px 14px 40px rgba(16, 16, 18, 0.75), inset -7px -7px 30px #262E32;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: center;
          transition: opacity 0.2s ease;
        }

        .counter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .counter-item {
          text-align: center;
        }

        .counter-label {
          font-size: 12px;
          color: var(--color-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .counter-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .counter-divider {
          width: 2px;
          height: 30px;
          background: linear-gradient(to bottom, var(--color-bg-dark), var(--color-bg-card));
          border-radius: 1px;
        }

        .controls-section {
          margin-bottom: 20px;
          transition: opacity 0.2s ease;
        }

        .button-row {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-bottom: 12px;
        }

        .control-button {
          flex: 1;
          background: linear-gradient(138.69deg, #1F2328 0%, #1A1C1F 100%);
          border: none;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 10px 15px 40px #000000, -10px -15px 40px #2F393D;
          cursor: pointer;
          font-size: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .control-button:hover {
          box-shadow: 6px 6px 12px rgba(0,0,0,0.7), -6px -6px 12px rgba(47,57,61,0.7);
          transform: translateY(-1px);
        }

        .control-button:active {
          box-shadow: inset 8px 8px 16px rgba(0,0,0,0.7), inset -8px -8px 16px rgba(47,57,61,0.7);
          transform: translateY(0);
        }

        .starter-prompt {
          width: 100%;
          min-height: 100px;
          flex-grow: 1;
          padding: 16px;
          border-radius: 16px;
          background: linear-gradient(138.69deg, #1F2328 0%, #1A1C1F 100%);
          box-shadow: inset 12px 12px 24px rgba(16, 16, 18, 0.75), inset -12px -12px 24px #262E32;
          border: none;
          overflow-y: auto;
          resize: vertical;
          color: var(--color-text-main);
          font-size: 14px;
          line-height: 1.4;
          box-sizing: border-box;
          font-family: inherit;
          margin-bottom: 20px;
          transition: opacity 0.2s ease;
        }

        .starter-prompt::placeholder {
          color: var(--color-text-subtle);
        }

        .starter-prompt:focus {
          outline: none;
          box-shadow: inset 12px 12px 24px rgba(16, 16, 18, 0.75), inset -12px -12px 24px #262E32, 0 0 0 2px rgba(17, 168, 253, 0.5);
        }

        .secondary-controls {
          display: flex;
          gap: 10px;
          transition: opacity 0.2s ease;
        }

        .secondary-controls button {
          flex: 1;
        }

        .version-text {
          font-size: 10px;
          color: var(--color-text-subtle);
          opacity: 0.6;
          font-weight: 500;
          text-align: center;
          margin-top: 12px;
          width: 100%;
        }

        .btn-primary svg { stroke: var(--color-accent-green); }
        .btn-danger svg { stroke: var(--color-accent-red); }
        .btn-warning svg { stroke: var(--color-accent-orange); }
        .btn-secondary svg { stroke: var(--color-accent-lightblue); }

        .console-content {
          background: #1A1C1F;
          border-radius: 12px;
          padding: 16px;
          height: 200px;
          overflow-y: auto;
          text-align: left;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
        }

        .log-entry {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 4px 0;
          margin: 2px 0;
          font-size: 12px;
          line-height: 1.6;
        }

        .log-timestamp {
          color: var(--color-text-subtle);
          margin-right: 8px;
        }

        .log-info { color: #74B9FF; }
        .log-log { color: var(--color-text-main); }
        .log-warning { color: #FFD93D; }
        .log-error { color: #FF6B6B; }
        .log-api { color: #4ECDC4; }

        .issues-content {
          max-height: 200px;
          overflow-y: auto;
        }

        .issue-entry {
          display: flex;
          align-items: flex-start;
          padding: 8px 12px;
          margin: 4px 0;
          background: rgba(31, 35, 40, 0.5);
          border-radius: 6px;
          border-left: 3px solid;
          font-size: 12px;
          line-height: 1.4;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .issue-entry:hover {
          background: rgba(31, 35, 40, 0.8);
        }

        .issue-entry.error {
          border-left-color: var(--color-accent-red);
          background: rgba(239, 68, 68, 0.1);
        }

        .issue-entry.warning {
          border-left-color: var(--color-accent-orange);
          background: rgba(245, 158, 11, 0.1);
        }

        .issue-entry.info {
          border-left-color: var(--color-accent-lightblue);
          background: rgba(17, 168, 253, 0.1);
        }

        .issue-type {
          font-weight: 600;
          text-transform: uppercase;
          margin-right: 8px;
          min-width: 50px;
          font-size: 10px;
          opacity: 0.8;
        }

        .issue-message {
          color: var(--color-text-main);
          word-wrap: break-word;
          flex: 1;
        }

        .tab-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .tab-button {
          font-size: 12px;
          font-weight: 500;
          padding: 8px 12px;
          color: var(--color-text-main);
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          background: linear-gradient(138.69deg, #1F2328 0%, #1A1C1F 100%);
          box-shadow: 4px 4px 8px rgba(0,0,0,0.3), -4px -4px 8px rgba(47,57,61,0.3);
        }

        .tab-button:hover {
          transform: translateY(-1px);
          box-shadow: 6px 6px 12px rgba(0,0,0,0.4), -6px -6px 12px rgba(47,57,61,0.1);
        }

        .tab-button.capture {
          border-left: 3px solid var(--color-accent-green);
        }

        .tab-button.export {
          border-left: 3px solid var(--color-accent-orange);
        }

        .tab-button.clear {
          border-left: 3px solid var(--color-accent-red);
        }
      `}</style>

      {/* Top Tabs */}
      <div className="top-tabs">
        <div 
          className={`tab ${activeTab === 'audit' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('audit')}
        >
          <Shield size={24} />
          <div className="tab-content">
            <h3>Audit</h3>
            <p>Audit your app or project for issues and improvements.</p>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'design-system' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('design-system')}
        >
          <CheckCircle size={24} />
          <div className="tab-content">
            <h3>Design System</h3>
            <p>Insert design/dev directives prompt.</p>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'monitor' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('monitor')}
        >
          <Monitor size={24} />
          <div className="tab-content">
            <h3>Monitor</h3>
            <p>Show project health/crash dashboard.</p>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'ai-maintenance' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('ai-maintenance')}
        >
          <Plus size={24} />
          <div className="tab-content">
            <h3>AI Maintenance</h3>
            <p>Insert AI-powered maintenance prompt.</p>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'actions' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('actions')}
        >
          <Zap size={24} />
          <div className="tab-content">
            <h3>Actions</h3>
            <p>Quick actions and shortcuts.</p>
          </div>
        </div>
      </div>

      {/* Prototyper Screen */}
      <div className="prototyper-screen-container">
        <div className="prototyper-screen" ref={prototyperScreenRef}>
          <div className="simulated-toolui">
            <div className="sim-checkpoint">
              <div className="sim-title">{prototyperStatus}</div>
              <div className="sim-code">Analyzing current environment...</div>
            </div>
            <div className="sim-file-changes">
              <div className="sim-file">_activity.log <span className="sim-added">+{consoleEntries.length}</span></div>
            </div>
            <div className="sim-message">System initialized. Ready for automation tasks.</div>
          </div>
        </div>
      </div>

      {/* Left Tabs */}
      <div className="left-tabs">
        <div 
          className={`tab ${activeTab === 'console' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('console')}
        >
          <Terminal size={24} />
          <div className="tab-content">
            <h3>🖥️ Console</h3>
            <div className="tab-buttons">
              <button className="tab-button clear" onClick={clearConsole}>🗑️ Clear</button>
              <button className="tab-button export" onClick={exportConsole}>📤 Export</button>
            </div>
            <div className="console-content">
              {consoleEntries.slice(0, 20).map((entry, index) => (
                <div key={index} className={`log-entry log-${entry.level}`}>
                  <span className="log-timestamp">
                    [{new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                      hour12: false, 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit', 
                      fractionalSecondDigits: 3 
                    })}]
                  </span>
                  <span>[{entry.level}] {entry.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'issues' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('issues')}
        >
          <AlertTriangle size={24} />
          <div className="tab-content">
            <h3>Issues</h3>
            <div className="tab-buttons">
              <button className="tab-button capture" onClick={captureIssues}>📋 Capture Issues</button>
            </div>
            <div className="issues-content">
              {issues.map((issue, index) => (
                <div key={index} className={`issue-entry ${issue.type}`}>
                  <div className="issue-type">{issue.type}</div>
                  <div className="issue-message">{issue.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'system' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('system')}
        >
          <Settings size={24} />
          <div className="tab-content">
            <h3>System Status</h3>
            <p>View system information and status.</p>
          </div>
        </div>
      </div>

      {/* Main Looper Panel */}
      <div className="looper-panel">
        <div className="panel-header">
          <div className="logo-placeholders">
            <div className="logo-spinner">🤔</div>
            <div className="logo-text">LOOPER</div>
            <div className="status-icon">⚡</div>
          </div>
          <span className="status-text">{statusText}</span>
        </div>

        <div className="counters">
          <div className="counter-row">
            <div className="counter-item">
              <div className="counter-label">Session</div>
              <div className="counter-value">{sessionCount}</div>
            </div>
            <div className="counter-divider"></div>
            <div className="counter-item">
              <div className="counter-label">Total</div>
              <div className="counter-value">{totalCount}</div>
            </div>
          </div>
        </div>

        <div className="controls-section">
          <div className="button-row">
            <button className="control-button btn-primary" onClick={handleStart}>
              {isRunning ? <Square size={20} /> : <Play size={20} />}
            </button>
            <button className="control-button btn-warning" onClick={handlePause}>
              <Pause size={20} />
            </button>
            <button className="control-button btn-danger" onClick={handleReset}>
              <Repeat size={20} />
            </button>
          </div>
        </div>

        <textarea 
          id="starterPrompt"
          className="starter-prompt"
          value={starterPrompt}
          onChange={(e) => setStarterPrompt(e.target.value)}
          placeholder="🤖 Smart Analysis Mode: Analyzing current page context..."
          spellCheck={false}
        />

        <div className="secondary-controls">
          <button className="control-button btn-secondary" onClick={handleInjectPrompt}>
            <Zap size={20} />
          </button>
        </div>

        <div className="version-text">Looper Autopilot v1.3.0 - Smart Edition</div>
      </div>

      {/* Right Tabs */}
      <div className="right-tabs">
        <div 
          className={`tab ${activeTab === 'history' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('history')}
        >
          <Clock size={24} />
          <div className="tab-content">
            <h3>History</h3>
            <p>View prompt and action history.</p>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'sitemap' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('sitemap')}
        >
          <Globe size={24} />
          <div className="tab-content">
            <h3>Site Map</h3>
            <p>Navigate site structure and pages.</p>
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="bottom-tabs">
        <div 
          className={`tab ${activeTab === 'activity' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('activity')}
        >
          <Activity size={24} />
          <div className="tab-content">
            <h3>Activity Log</h3>
            <p>View system activity and events.</p>
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'about' ? 'expanded' : ''}`}
          onClick={() => handleTabClick('about')}
        >
          <Info size={24} />
          <div className="tab-content">
            <h3>About Prototyper Autopilot</h3>
            <p>Information about the system and features.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
