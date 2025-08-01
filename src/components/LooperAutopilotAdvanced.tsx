
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
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
  Square,
  Repeat,
  Clock,
  Globe,
  Trash2,
  Upload,
  Pause,
  X,
  History,
  Search,
  FileText,
  Loader
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { generateSitemap, type GenerateSitemapOutput } from '@/ai/flows/generate-sitemap';
import { auditUICommands, type AuditUICommandsOutput } from '@/ai/flows/audit-ui-commands';


interface TabProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
  onClick: (id: string) => void;
  onMouseEnter: () => void;
  isActive: boolean;
  className?: string;
}

const Tab: React.FC<TabProps> = ({ id, icon: Icon, title, children, onClick, onMouseEnter, isActive, className, description }) => {
  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-400 ease-in-out",
        "w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900",
        "hover:scale-110",
        isActive ? "z-20 rounded-2xl bg-gradient-to-b from-[#353A40] to-[#16171B] shadow-lg overflow-hidden" : "z-10",
        className
      )}
      onClick={() => onClick(id)}
      onMouseEnter={onMouseEnter}
      data-tooltip={title}
    >
      <div className="flex items-center justify-center w-14 h-14">
        <Icon size={24} className={cn("text-slate-400 transition-opacity", isActive && "opacity-0")} />
      </div>
      {isActive && (
        <div className="absolute inset-0 opacity-100 transition-opacity duration-300 delay-200 p-6 flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="text-slate-400 text-sm w-full h-full flex flex-col">{children || description}</div>
        </div>
      )}
    </div>
  );
};

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
  isLoading
}: any) => {
  return (
    <div className="w-[300px] h-[652px] p-7 rounded-[60px] bg-gradient-to-b from-[#353A40] to-[#16171B] shadow-2xl flex flex-col font-sans relative">
        <Button variant="ghost" size="icon" className="absolute top-4 right-[-10px] w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 hover:scale-110" data-tooltip="Close">
            <X size={18} className="text-slate-400"/>
        </Button>
      <div className="text-center mb-6 cursor-move">
        <div className="grid grid-cols-3 items-center h-6 mb-3">
            <div className="justify-self-end">
                 {isThinking && <Image id="logoSpinner" src="https://ik.imagekit.io/oe3ifd1ja/Vector/think.svg?updatedAt=1753268203003" alt="Spinner" width={24} height={24} className="animate-rotate-think"/>}
            </div>
            <div className={cn("text-white font-semibold transition-all justify-self-center", isRunning && "animate-glow")}>
                 <Image id="logoTextImg" src={isRunning ? "https://ik.imagekit.io/oe3ifd1ja/Vector/looper_on.svg?updatedAt=1753374507503" : "https://ik.imagekit.io/oe3ifd1ja/Vector/looper_off.svg?updatedAt=1753374521185"} alt="Looper Logo" width={90} height={24} className={cn(isRunning && "drop-shadow-[0_0_6px_hsl(var(--primary))]")}/>
            </div>
            <div className="justify-self-start">
              {!isThinking && <div className="text-2xl animate-pulse-subtle">⚡</div>}
            </div>
        </div>
        <div className="text-xs uppercase tracking-wider text-slate-400">{statusText}</div>
      </div>
      
      <div className="bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] rounded-2xl p-5 mb-6 shadow-[inset_14px_14px_40px_rgba(16,16,18,0.75),inset_-7px_-7px_30px_#262E32]">
        {isLoading ? (
          <div className="text-center text-slate-400">Connecting...</div>
        ) : (
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
        )}
      </div>

      <div className="mb-5">
        <div className="flex gap-2.5 mb-3">
          <Button onClick={handleStart} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200" disabled={isLoading}>
            {isRunning ? <Square size={20} className="text-destructive" /> : <Play size={20} className="text-primary" />}
          </Button>
          <Button onClick={handlePause} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200" disabled={isLoading}>
            <Pause size={20} className="text-yellow-500" />
          </Button>
          <Button onClick={handleReset} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200" disabled={isLoading}>
            <Repeat size={20} className="text-accent" />
          </Button>
        </div>
      </div>
      
      <textarea 
        id="starterPrompt"
        className="w-full flex-grow p-4 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[inset_12px_12px_24px_rgba(16,16,18,0.75),inset_-12px_-12px_24px_#262E32] text-white text-sm resize-none mb-5 focus:outline-none focus:ring-2 focus:ring-primary"
        value={starterPrompt}
        onChange={(e) => setStarterPrompt(e.target.value)}
        placeholder="🤖 Smart Analysis Mode: Analyzing current page context..."
        spellCheck={false}
      />

      <div className="flex gap-2.5">
        <Button onClick={handleInjectPrompt} className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200" disabled={isLoading}>
          <Zap size={20} className="text-accent" />
        </Button>
      </div>

      <div className="text-center text-xs text-slate-500 mt-auto">
        Looper Autopilot v1.3.0 - Smart Edition
      </div>
    </div>
  )
}

export const LooperAutopilotAdvanced: React.FC<{className?: string, projectName: string}> = ({ className, projectName }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [consoleEntries, setConsoleEntries] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [starterPrompt, setStarterPrompt] = useState('');
  const [statusText, setStatusText] = useState('Ready');
  const [isThinking, setIsThinking] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  
  const [sitemap, setSitemap] = useState<GenerateSitemapOutput['sitemap'] | null>(null);
  const [isScanningSitemap, setIsScanningSitemap] = useState(false);

  const [auditResult, setAuditResult] = useState<AuditUICommandsOutput | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const playTabBeep = () => {
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 164;
        g.gain.setValueAtTime(0.13, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.16);
        o.onended = () => ctx.close().catch(() => {});
      }
    } catch (e) {
      console.error('Audio could not play', e);
    }
  };

  const playTabHoverBeep = () => {
     try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = 1568;
        g.gain.setValueAtTime(0.07, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.07);
        o.onended = () => ctx.close().catch(() => {});
      }
    } catch (e) {
       console.error('Audio could not play', e);
    }
  };

  const handleStart = () => {
    if (isLoading) return;
    const willBeRunning = !isRunningRef.current;
    setIsRunning(willBeRunning);
    if(isPaused) setIsPaused(false);
  
    if (willBeRunning) {
      setSessionCount(prev => prev + 1);
      
      const newTotalCount = totalCount + 1;
      setTotalCount(newTotalCount);
  
      if (projectName && user) {
        const docId = `project_stats_${projectName.replace(/\s+/g, '_')}`;
        const docRef = doc(db, "projectStats", docId);
        setDoc(docRef, { totalCount: newTotalCount }, { merge: true });
      }
  
      setStatusText('Processing...');
      setIsThinking(true);
      const newEntry = { timestamp: Date.now(), level: 'log', message: `Autopilot starting with prompt: ${starterPrompt.substring(0, 50)}...` };
      setConsoleEntries(prev => [newEntry, ...prev]);
  
      setTimeout(() => {
        if(isRunningRef.current) {
           setStatusText('Task Complete');
           setIsThinking(false);
        }
      }, 3000);
    } else {
      setStatusText('Stopped');
      setIsThinking(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && projectName) {
        setIsLoading(true);
        const docId = `project_stats_${projectName.replace(/\s+/g, '_')}`;
        const docRef = doc(db, "projectStats", docId);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTimeSpent(data.timeSpent || 0);
            setTotalCount(data.totalCount || 0);
          } else {
            setTimeSpent(0);
            setTotalCount(0);
          }
        } catch (error) {
          console.error("Error fetching project stats:", error);
          setTimeSpent(0);
          setTotalCount(0);
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [projectName]);


  // Auto-start the timer once everything is loaded
  useEffect(() => {
    if (!isLoading && !isRunning && user && projectName) {
      handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user, projectName]);


  useEffect(() => {
    if (isLoading || !projectName || isPaused || !isRunning || !user) {
      return;
    }
  
    const interval = setInterval(() => {
      setTimeSpent(prevTime => {
        const newTime = prevTime + 1;
        const docId = `project_stats_${projectName.replace(/\s+/g, '_')}`;
        const docRef = doc(db, "projectStats", docId);

        setDoc(docRef, { timeSpent: newTime }, { merge: true }).catch(error => {
           console.error("Error updating time spent:", error);
        });
        return newTime;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [projectName, isLoading, isPaused, isRunning, user]);


  useEffect(() => {
     if (typeof window !== 'undefined') {
      localStorage.setItem('looper-total-count', totalCount.toString());
     }
  }, [totalCount]);

  useEffect(() => {
     if (typeof window !== 'undefined') {
      localStorage.setItem('starterPrompt', starterPrompt);
      localStorage.setItem('logEntries', JSON.stringify(consoleEntries));
     }
  }, [starterPrompt, consoleEntries]);

  const handleTabClick = (tabId: string) => {
    playTabBeep();
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  const handlePause = () => {
    if(isRunning) {
        const willBePaused = !isPaused;
        setIsPaused(willBePaused);
        if(willBePaused) {
          setStatusText('Paused');
          setIsThinking(false);
        } else {
          setStatusText('Processing...');
          if(isRunning) setIsThinking(true);
        }
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
    const newEntry = { timestamp: Date.now(), level: 'api', message: `Injecting prompt: ${starterPrompt.substring(0, 50)}...` };
    setConsoleEntries(prev => [newEntry, ...prev]);
  };

  const captureIssues = () => setIssues([{ type: 'info', message: 'No issues detected. Page appears to be functioning correctly.' }]);
  const clearConsole = () => setConsoleEntries([]);
  const exportConsole = () => {
    if (typeof window === 'undefined') return;
    const dataStr = JSON.stringify(consoleEntries, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `console-log-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateSitemap = useCallback(async () => {
    if (typeof window === 'undefined' || isScanningSitemap) return;
    setIsScanningSitemap(true);
    setSitemap(null);
    try {
      const bodyHtml = document.body.outerHTML;
      const result = await generateSitemap({ html: bodyHtml });
      setSitemap(result.sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      setConsoleEntries(prev => [{ timestamp: Date.now(), level: 'error', message: 'Failed to generate sitemap.' }, ...prev]);
    } finally {
      setIsScanningSitemap(false);
    }
  }, [isScanningSitemap]);
  
  const handleAuditPrompt = useCallback(async () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditResult(null);
    try {
      const result = await auditUICommands({ prompt: starterPrompt });
      setAuditResult(result);
    } catch (error) {
      console.error("Error auditing prompt:", error);
      setConsoleEntries(prev => [{ timestamp: Date.now(), level: 'error', message: 'Failed to audit prompt.' }, ...prev]);
      setAuditResult({ riskLevel: 'High', assessment: 'Could not analyze prompt due to an error.' });
    } finally {
      setIsAuditing(false);
    }
  }, [isAuditing, starterPrompt]);

  useEffect(() => {
    if (activeTab === 'sitemap' && !sitemap) {
        handleGenerateSitemap();
    }
    if (activeTab === 'monitor') {
        handleAuditPrompt();
    }
  }, [activeTab, sitemap, handleGenerateSitemap, handleAuditPrompt]);

  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    totalSeconds %= (3600 * 24);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const getRiskColor = (riskLevel: AuditUICommandsOutput['riskLevel']) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-orange-400';
      case 'Critical': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };


  const TABS = {
    top: [
      { id: 'audit', icon: Shield, title: "Audit", description: "Audit your app for issues." },
      { id: 'design-system', icon: CheckCircle, title: "Design System", description: "Insert design/dev directives." },
      { id: 'monitor', icon: Monitor, title: "Monitor", description: "Show project health dashboard.", children: (
        <div className="w-full h-full flex flex-col text-left">
          <h4 className="text-lg font-semibold text-white mb-2">Prompt Safety Analysis</h4>
           {isAuditing && (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400 h-full">
                <Loader className="animate-spin h-8 w-8" />
                <span>Auditing Prompt...</span>
              </div>
            )}
            {!isAuditing && auditResult && (
                 <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <span className="font-semibold text-slate-400">Risk Level: </span>
                        <span className={cn("font-bold", getRiskColor(auditResult.riskLevel))}>{auditResult.riskLevel}</span>
                    </div>
                    <div>
                         <span className="font-semibold text-slate-400">Assessment:</span>
                         <p className="text-slate-300 bg-slate-900/50 rounded-md p-2 mt-1">{auditResult.assessment}</p>
                    </div>
                 </div>
            )}
        </div>
      ) },
      { id: 'ai-maintenance', icon: Plus, title: "AI Maintenance", description: "Insert AI maintenance prompt." },
      { id: 'actions', icon: Zap, title: "Actions", description: "Quick actions and shortcuts." },
    ],
    left: [
      { id: 'console', icon: Terminal, title: "Console", description: "View system console output.", children: (
        <div className="w-full h-full flex flex-col text-left">
          <div className="flex gap-2 mb-2">
            <Button size="sm" variant="ghost" onClick={clearConsole} className="text-xs text-slate-300 hover:bg-slate-700"><Trash2 className="mr-1 h-3 w-3" /> Clear</Button>
            <Button size="sm" variant="ghost" onClick={exportConsole} className="text-xs text-slate-300 hover:bg-slate-700"><Upload className="mr-1 h-3 w-3" /> Export</Button>
          </div>
          <div className="flex-grow bg-slate-900/50 rounded-md p-2 text-xs font-mono overflow-y-auto">
            {consoleEntries.slice(0, 50).map((entry, index) => (
              <div key={index} className="flex items-start gap-2 text-slate-400">
                <span className="text-slate-500">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                <span className={cn('whitespace-pre-wrap break-all', entry.level === 'log' && 'text-slate-300', entry.level === 'api' && 'text-cyan-400', entry.level === 'error' && 'text-red-400', entry.level === 'warning' && 'text-yellow-400')}>[{entry.level}] {entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      ) },
      { id: 'issues', icon: AlertTriangle, title: "Issues", description: "DevTools-style issue detection.", children: (
         <div className="w-full h-full flex flex-col text-left">
           <div className="flex gap-2 mb-2">
            <Button size="sm" variant="ghost" onClick={captureIssues} className="text-xs text-slate-300 hover:bg-slate-700">Capture Issues</Button>
           </div>
           <div className="flex-grow bg-slate-900/50 rounded-md p-2 text-xs font-mono overflow-y-auto">
             {issues.map((issue, index) => (
                <div key={index} className={cn("flex items-start gap-2 p-1 rounded", issue.type === 'info' && 'bg-blue-900/30 text-blue-300', issue.type === 'warning' && 'bg-yellow-900/30 text-yellow-300', issue.type === 'error' && 'bg-red-900/30 text-red-300')}>
                  <div className="font-bold uppercase">{issue.type}</div>
                  <div>{issue.message}</div>
                </div>
              ))}
           </div>
         </div>
      )},
      { id: 'system', icon: Settings, title: "System Status", description: "View system information." },
    ],
    right: [
      { id: 'history', icon: History, title: "History", description: "View prompt and action history." },
      { id: 'sitemap', icon: Globe, title: "Site Map", description: "Navigate site structure.", children: (
        <div className="w-full h-full flex flex-col text-left">
          <div className="flex-grow bg-slate-900/50 rounded-md p-2 text-xs font-mono overflow-y-auto flex items-center justify-center">
            {isScanningSitemap && (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader className="animate-spin h-8 w-8" />
                <span>Scanning Project...</span>
              </div>
            )}
            {!isScanningSitemap && sitemap && sitemap.length === 0 && <div>No pages found.</div>}
            {!isScanningSitemap && sitemap && (
              <div className="w-full h-full overflow-y-auto">
                {sitemap.map((page, index) => (
                  <div key={index} className="mb-2 p-2 rounded bg-slate-800/50">
                    <div className="font-bold text-white flex items-center"><FileText size={14} className="mr-2" />{page.title}</div>
                    <div className="text-cyan-400 text-xs my-1">{page.path}</div>
                    <div className="text-slate-400">{page.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) },
      { id: 'time', icon: Clock, title: "Time Management", description: "Track time spent on the project.", children: (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <div className="text-lg text-slate-400 mb-2">Time Spent on '{projectName}'</div>
          {isLoading ? (
            <div className="text-4xl font-bold text-white font-mono tracking-wider">Loading...</div>
          ) : (
            <div className="text-4xl font-bold text-white font-mono tracking-wider">
              {formatTime(timeSpent)}
            </div>
          )}
        </div>
      ) },
    ],
    bottom: [
      { id: 'activity', icon: Activity, title: "Activity Log", description: "View system activity." },
      { id: 'about', icon: Info, title: "About", description: "Information about the system." },
    ]
  };

  const renderTabs = (tabData: Omit<TabProps, 'onClick' | 'onMouseEnter' | 'isActive'>[]) => 
    tabData.map(tab => 
      <Tab key={tab.id} {...tab} onClick={handleTabClick} onMouseEnter={playTabHoverBeep} isActive={activeTab === tab.id}
        className={cn(
          (tab.id === 'console' || tab.id === 'issues' || tab.id === 'sitemap') && activeTab === tab.id && "w-80 h-96",
          (tab.id !== 'console' && tab.id !== 'issues' && tab.id !== 'sitemap') && activeTab === tab.id && "w-96 h-52",
        )}
      />
    );

  return (
    <div className={cn("relative grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-5 items-center justify-items-center p-5 transform scale-90", className)}>
        {/* Top */}
        <div className="col-start-2 row-start-1 flex flex-row gap-5">
          {renderTabs(TABS.top)}
        </div>
        
        {/* Left */}
        <div className="col-start-1 row-start-2 flex flex-col gap-5 justify-self-end">
          {renderTabs(TABS.left)}
        </div>
        
        {/* Center */}
        <div className="col-start-2 row-start-2">
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
            isLoading={isLoading}
          />
        </div>

        {/* Right */}
        <div className="col-start-3 row-start-2 flex flex-col gap-5 justify-self-start">
          {renderTabs(TABS.right)}
        </div>

        {/* Bottom */}
        <div className="col-start-2 row-start-3 flex flex-row gap-5">
            {renderTabs(TABS.bottom)}
        </div>
    </div>
  );
};
