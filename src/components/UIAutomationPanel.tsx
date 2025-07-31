
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
  Globe,
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
  handleInjectPrompt
}: any) => {
  return (
    <div className="w-full max-w-sm h-[652px] p-7 rounded-[60px] bg-gradient-to-b from-[#353A40] to-[#16171B] shadow-2xl flex flex-col font-sans">
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
      />

      <div className="flex gap-2.5">
        <Button onClick={handleInjectPrompt} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200">
          <Zap size={20} className="text-blue-400" />
        </Button>
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


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTotalCount(parseInt(localStorage.getItem('looper-total-count') || '0'));
      setStarterPrompt(localStorage.getItem('starterPrompt') || '');
      const savedEntries = JSON.parse(localStorage.getItem('logEntries') || '[]');
      setConsoleEntries(savedEntries);
    }
  }, []);

  useEffect(() => {
     if (typeof window !== 'undefined') {
      localStorage.setItem('looper-total-count', totalCount.toString());
     }
  }, [totalCount]);

  useEffect(() => {
     if (typeof window !== 'undefined') {
      localStorage.setItem('starterPrompt', starterPrompt);
     }
  }, [starterPrompt]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setSessionCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
      setStatusText('Processing...');
      setIsThinking(true);
      
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
    setStatusText(isPaused ? 'Processing...' : 'Paused');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset everything?')) {
      setIsRunning(false);
      setIsPaused(false);
      setSessionCount(0);
      setStatusText('Ready');
      setIsThinking(false);
      setStarterPrompt('');
    }
  };

  const handleInjectPrompt = () => {
    const newEntry = {
      timestamp: Date.now(),
      level: 'api',
      message: `Injecting prompt: ${starterPrompt.substring(0, 50)}...`
    };
    setConsoleEntries(prev => [newEntry, ...prev]);
    // In a real scenario, this would interact with a browser extension API
    console.log("Injecting prompt:", starterPrompt);
  };

  return (
    <div className={cn("relative flex justify-center items-center p-5 transform scale-90", className)}>
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
      />
    </div>
  );
};
