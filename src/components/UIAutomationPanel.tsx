
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play,
  Pause,
  Square,
  Repeat,
  Zap,
  Trash2,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface UIAutomationPanelProps {
  className?: string;
}

const MainPanel = ({
  sessionCount,
  totalCount,
  statusText,
  isRunning,
  isThinking,
  handleStart,
  handlePause,
  handleReset,
  starterPrompt,
  setStarterPrompt,
  handleInjectPrompt,
  consoleEntries,
  clearConsole,
  exportConsole
}: any) => {
  return (
    <div className="w-full max-w-md h-auto p-7 rounded-[60px] bg-gradient-to-b from-[#353A40] to-[#16171B] shadow-2xl flex flex-col font-sans">
      <div className="text-center mb-6">
        <div className="grid grid-cols-3 items-center h-6 mb-3">
          <div className="justify-self-end">
            {isThinking && <div className="animate-spin text-2xl">🤔</div>}
          </div>
          <div className="text-white font-semibold">LOOPER</div>
          <div className="justify-self-start">
            {!isThinking && <div className="text-2xl">⚡</div>}
          </div>
        </div>
        <div className="text-xs uppercase tracking-wider text-slate-400">{statusText}</div>
      </div>
      
      <div className="bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] rounded-2xl p-5 mb-6 shadow-[inset_14px_14px_40px_rgba(16,16,18,0.75),inset_-7px_-7px_30px_#262E32]">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-xs uppercase text-slate-400 tracking-wider">Session</div>
            <div className="text-2xl font-semibold text-white">{sessionCount}</div>
          </div>
          <div className="w-0.5 h-8 bg-gradient-to-b from-[#16171B] to-[#353A40] rounded-full"/>
          <div className="text-center">
            <div className="text-xs uppercase text-slate-400 tracking-wider">Total</div>
            <div className="text-2xl font-semibold text-white">{totalCount}</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex gap-2.5 mb-3">
          <Button onClick={handleStart} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200">
            {isRunning ? <Square size={20} className="text-green-500" /> : <Play size={20} className="text-green-500" />}
          </Button>
          <Button onClick={handlePause} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200">
            <Pause size={20} className="text-yellow-500" />
          </Button>
          <Button onClick={handleReset} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200">
            <Repeat size={20} className="text-red-500" />
          </Button>
        </div>
      </div>
      
      <textarea 
        className="w-full flex-grow p-4 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[inset_12px_12px_24px_rgba(16,16_18,0.75),inset_-12px_-12px_24px_#262E32] text-white text-sm resize-none mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={starterPrompt}
        onChange={(e) => setStarterPrompt(e.target.value)}
        placeholder="Describe the changes you want to make..."
        spellCheck={false}
        rows={5}
      />

      <div className="flex gap-2.5 mb-5">
        <Button onClick={handleInjectPrompt} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200">
          <Zap size={20} className="text-blue-400" />
        </Button>
      </div>

      <div className="flex flex-col h-48 bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] rounded-2xl p-4 shadow-[inset_12px_12px_24px_rgba(16,16,18,0.75),inset_-12px_-12px_24px_#262E32] mb-5">
        <div className="flex-shrink-0 flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-slate-300">Real-time Console</h3>
            <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={clearConsole} className="text-xs h-auto px-2 py-1"><Trash2 className="mr-1 h-3 w-3" /> Clear</Button>
                <Button size="sm" variant="ghost" onClick={exportConsole} className="text-xs h-auto px-2 py-1"><Upload className="mr-1 h-3 w-3" /> Export</Button>
            </div>
        </div>
        <div className="flex-grow text-xs font-mono overflow-y-auto pr-2">
            {consoleEntries.map((entry, index) => (
            <div key={index} className="flex items-start gap-2 text-slate-400">
                <span className="text-slate-500">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                <span className={cn(
                    'whitespace-pre-wrap break-all',
                    entry.level === 'log' && 'text-slate-300',
                    entry.level === 'api' && 'text-cyan-400',
                    entry.level === 'system' && 'text-purple-400',
                    entry.level === 'error' && 'text-red-400',
                )}>
                    [{entry.level}] {entry.message}
                </span>
            </div>
            ))}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 mt-auto">
        Looper Autopilot v1.3.0 - Smart Edition
      </div>
    </div>
  )
}

export const UIAutomationPanel: React.FC<UIAutomationPanelProps> = ({ className }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [consoleEntries, setConsoleEntries] = useState<any[]>([]);
  const [statusText, setStatusText] = useState('Ready');
  const [isThinking, setIsThinking] = useState(false);
  const [starterPrompt, setStarterPrompt] = useState('');
  const logIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTotalCount(parseInt(localStorage.getItem('looper-total-count') || '0'));
      setStarterPrompt(localStorage.getItem('starterPrompt') || '');
      try {
        const savedEntries = JSON.parse(localStorage.getItem('logEntries') || '[]');
        setConsoleEntries(savedEntries);
      } catch (e) {
        setConsoleEntries([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('looper-total-count', totalCount.toString());
      localStorage.setItem('starterPrompt', starterPrompt);
      localStorage.setItem('logEntries', JSON.stringify(consoleEntries));
    }
  }, [totalCount, starterPrompt, consoleEntries]);

  const addLogEntry = (level: string, message: string) => {
      setConsoleEntries(prev => [{
          timestamp: Date.now(),
          level,
          message
      }, ...prev]);
  };

  useEffect(() => {
    addLogEntry('system', 'Console initialized. Monitoring for events...');
    
    logIntervalRef.current = setInterval(() => {
        addLogEntry('log', 'Checking for new page events...');
    }, 5000);

    return () => {
        if (logIntervalRef.current) {
            clearInterval(logIntervalRef.current);
        }
    }
  }, []);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      setSessionCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
      setStatusText('Processing...');
      setIsThinking(true);
      
      addLogEntry('system', `Autopilot starting with prompt: ${starterPrompt.substring(0, 50)}...`);

      // Simulate processing
      setTimeout(() => {
          if (isRunning) {
              setIsThinking(false);
              setStatusText('Completed');
              addLogEntry('system', 'Processing complete.');
              setTimeout(() => {
                  setStatusText('Ready');
                  setIsRunning(false);
              }, 2000);
          }
      }, 3000);

    } else {
      setIsRunning(false);
      setStatusText('Ready');
      setIsThinking(false);
      addLogEntry('system', 'Autopilot stopped by user.');
    }
  };

  const handlePause = () => {
    if (!isRunning) return;
    setIsPaused(!isPaused);
    const newStatus = isPaused ? 'Processing...' : 'Paused';
    setStatusText(newStatus);
    addLogEntry('system', `Autopilot ${newStatus}.`);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset everything?')) {
      setIsRunning(false);
      setIsPaused(false);
      setSessionCount(0);
      setStatusText('Ready');
      setIsThinking(false);
      setStarterPrompt('');
      addLogEntry('system', 'Session reset by user.');
    }
  };

  const handleInjectPrompt = () => {
    addLogEntry('api', `Injecting prompt: ${starterPrompt.substring(0, 50)}...`);
    // In a real scenario, this would interact with a browser extension API
    console.log("Injecting prompt:", starterPrompt);
  };
  
  const clearConsole = () => {
      setConsoleEntries([]);
  };

  const exportConsole = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `console-log-${timestamp}.json`;
    const dataStr = JSON.stringify(consoleEntries, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLogEntry('system', 'Console log exported.');
  };

  return (
    <div className={cn("relative flex justify-center items-center p-5 transform", className)}>
      <MainPanel 
        sessionCount={sessionCount}
        totalCount={totalCount}
        statusText={statusText}
        isRunning={isRunning}
        isThinking={isThinking}
        handleStart={handleStart}
        handlePause={handlePause}
        handleReset={handleReset}
        starterPrompt={starterPrompt}
        setStarterPrompt={setStarterPrompt}
        handleInjectPrompt={handleInjectPrompt}
        consoleEntries={consoleEntries}
        clearConsole={clearConsole}
        exportConsole={exportConsole}
      />
    </div>
  );
};
