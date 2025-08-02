
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { 
  Play,
  Square,
  Repeat,
  Clock,
  Trash2,
  Upload,
  Pause,
  X,
  FileText,
  Loader,
  ShieldCheck,
  Bot,
  Zap,
  AlertTriangle,
  FileClock,
  Settings,
  Terminal,
  Activity,
  Info,
  Badge,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { generateSitemap, type GenerateSitemapOutput } from '@/ai/flows/generate-sitemap';
import { auditUICommands, type AuditUICommandsOutput } from '@/ai/flows/audit-ui-commands';
import { extractUICommands } from '@/ai/flows/extract-ui-commands';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabProps {
  id: string;
  icon: React.ElementType;
  iconClassName?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  onClick: (id: string) => void;
  onMouseEnter: () => void;
  isActive: boolean;
  className?: string;
  consoleCount?: number;
  issueCount?: number;
}

const Tab: React.FC<TabProps> = ({ id, icon: Icon, iconClassName, title, children, onClick, onMouseEnter, isActive, className, description, consoleCount = 0, issueCount = 0 }) => {
  const tabContent = (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-400 ease-in-out",
        "w-14 h-14 rounded-full flex items-center justify-center",
        "bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D]",
        "hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] hover:scale-105",
        "active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)]",
        isActive ? "z-20 rounded-2xl bg-gradient-to-b from-[#353A40] to-[#16171B] shadow-lg overflow-hidden" : "z-10",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      onMouseEnter={onMouseEnter}
    >
        {!isActive && id === 'devtools' && (
          <div className="absolute top-0 right-0 -mt-1 -mr-1 flex flex-col gap-1">
            {consoleCount > 0 && (
              <div className="flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-blue-600 text-white text-[10px] font-bold px-1 border-2 border-[#1A1B1E]">
                {consoleCount}
              </div>
            )}
            {issueCount > 0 && (
              <div className="flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-red-600 text-white text-[10px] font-bold px-1 border-2 border-[#1A1B1E]">
                {issueCount}
              </div>
            )}
          </div>
        )}
      <div className="flex items-center justify-center w-14 h-14">
        <Icon size={24} className={cn("transition-opacity", isActive && "opacity-0", iconClassName)} />
      </div>
      {isActive && (
        <div className="absolute inset-0 opacity-100 transition-opacity duration-300 delay-200 p-6 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="text-slate-400 text-sm w-full h-full flex flex-col">{children || description}</div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{tabContent}</TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <div className="w-[300px] h-[652px] p-7 rounded-[60px] bg-gradient-to-b from-[#353A40] to-[#16171B] shadow-2xl flex flex-col font-sans relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-[-50px] right-[-50px] w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1F2328] to-[#1A1C1F] shadow-[10px_15px_40px_#000000,-10px_-15px_40px_#2F393D] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.7),-6px_-6px_12px_rgba(47,57,61,0.7)] hover:scale-105 active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(47,57,61,0.7)] transition-all duration-200" data-tooltip="Close">
            <X size={18} className="text-slate-400"/>
        </button>
      <div className="text-center mb-6 cursor-move">
        <div className="grid grid-cols-3 items-center h-6 mb-3">
            <div className="justify-self-end">
                 {isThinking && <Image id="logoSpinner" src="https://ik.imagekit.io/oe3ifd1ja/Vector/think.svg?updatedAt=1753268203003" alt="Spinner" width={24} height={24} className="animate-rotate-think" style={{ width: 'auto' }}/>}
            </div>
            <div className={cn("text-white font-semibold transition-all justify-self-center", isRunning && "animate-glow")}>
                 <Image priority id="logoTextImg" src={isRunning ? "https://ik.imagekit.io/oe3ifd1ja/Vector/looper_on.svg?updatedAt=1753374507503" : "https://ik.imagekit.io/oe3ifd1ja/Vector/looper_off.svg?updatedAt=1753374521185"} alt="Looper Logo" width={90} height={24} className={cn(isRunning && "drop-shadow-[0_0_6px_hsl(var(--primary))]")}/>
            </div>
            <div className="justify-self-start">
              {!isThinking && <div className="w-6 h-6"></div>}
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
        Looper Autopilot v2
      </div>
    </div>
  )
}

const fullScanPrompt = `Full Application Scan & New Task List Generation
Role: Product Strategist and Senior Software Engineer
We're performing a comprehensive, deep scan of the theoretical application space. Given our goal to build both frontend and backend files, our strategic prioritization for the top 3-5 most valuable, high-level features/improvements focuses on establishing the core architecture.

We'll prioritize setting up the foundational structure first, as this underpins all subsequent development.

HIGH_PRIORITY_TASKS.md (New List for Current Session)
TASK #1: Establish Core Frontend Project Structure & Initial Files

Status: To Do

Product Rationale: To create a modern, scalable, and maintainable foundation for the user interface, enabling rapid development of UI components and pages.

Internal Workflow Steps:

1. Scan App (Role: Senior Software Engineer):

Action: Research and select a suitable frontend framework (e.g., React, Vue, Angular) and project setup (e.g., Vite, Next.js, Create React App). Identify common folder structures for maintainability (components, pages, services, assets).

Goal: Define the initial tech stack and directory layout.

2. Check & Resolve Console & System Performance (Role: Expert Debugger / DevOps Engineer):

Action: No active console or system to monitor yet, but plan for future monitoring integration (e.g., how to include performance metrics in a development server).

Goal: Anticipate and plan for performance checks from the outset.

3. Check & Resolve Possible Improvements & Frontend Performance (Role: Design Technologist / Senior Software Engineer):

Action: Draft a .gitignore file and consider initial linting/formatting configurations (e.g., ESLint, Prettier) to promote code quality.

Goal: Ensure foundational development practices are in place.

4. Final Review & Completion (Role: Senior Software Engineer / Product Manager):

Action: Verify the project setup is complete and all initial files are correctly placed.

Goal: Confirm readiness for component development.

TASK #2: Establish Core Backend API Project Structure & Initial Files

Status: To Do

Product Rationale: To provide a robust and secure foundation for data management, business logic, and API endpoints, supporting the frontend application.

Internal Workflow Steps:

1. Scan App (Role: Senior Software Engineer):

Action: Research and select a suitable backend framework (e.g., Node.js with Express/NestJS, Python with Django/Flask, Go with Gin). Define initial API endpoint patterns and database connection strategy.

Goal: Define the initial backend tech stack and directory layout.

2. Check & Resolve Console & System Performance (Role: DevOps Engineer):

Action: Plan for server-side performance monitoring tools (e.g., Prometheus, Grafana, built-in framework logging) to track CPU, RAM, and network I/O.

Goal: Proactively establish monitoring strategies for backend resources.

3. Check & Resolve Possible Improvements & Frontend Performance (Role: Security Specialist / DevOps Engineer):

Action: Implement basic security considerations (e.g., CORS setup, environment variable management for sensitive data) and prepare for dependency management (e.g., package.json for Node.js).

Goal: Ensure foundational security and maintainability.

4. Final Review & Completion (Role: Senior Software Engineer / Product Manager):

Action: Verify the backend project setup is complete and all initial files are correctly placed.

Goal: Confirm readiness for API endpoint development.

TASK #3: Re-initiate Full Application Scan and Prioritization

Status: To Do

Product Rationale: To ensure continuous, proactive application enhancement and identify evolving priorities as the project progresses.

Internal Workflow Steps:

1. Initiate Scan (Role: Product Strategist):

Action: Signal the need for a new comprehensive scan.

Goal: Trigger the next iteration of strategic planning.

Signal:
New HIGH_PRIORITY_TASKS.md generated. Ready to proceed with TASK #1's internal workflow.

Buffer:
Waiting for 60 seconds (simulated pause). Awaiting your prompt to continue.
`;

export const LooperAutopilotAdvanced: React.FC<{className?: string, projectName: string}> = ({ className, projectName }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeDevToolsTab, setActiveDevToolsTab] = useState('console');
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
  const [promptHistory, setPromptHistory] = useState<any[]>([]);
  
  const timeSpentRef = useRef(timeSpent);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const fullScanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [sitemap, setSitemap] = useState<GenerateSitemapOutput['sitemap'] | null>(null);
  const [isScanningSitemap, setIsScanningSitemap] = useState(false);

  const [auditResult, setAuditResult] = useState<AuditUICommandsOutput | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  
  useEffect(() => {
    timeSpentRef.current = timeSpent;
  }, [timeSpent]);
  
  useEffect(() => {
    isRunningRef.current = isRunning;
    isPausedRef.current = isPaused;
    // If user stops or pauses, clear the auto-rescan timeout
    if (!isRunning || isPaused) {
      if (fullScanTimeoutRef.current) {
        clearTimeout(fullScanTimeoutRef.current);
        fullScanTimeoutRef.current = null;
      }
    }
  }, [isRunning, isPaused]);

  // Function to save time spent to Firestore
  const saveTimeSpent = useCallback(async () => {
    if (user && projectName) {
      if (timeSpentRef.current === 0) return;
      const docId = `project_stats_${projectName.replace(/\s+/g, '_')}`;
      const docRef = doc(db, "projectStats", docId);
      try {
        await setDoc(docRef, { timeSpent: timeSpentRef.current, totalCount }, { merge: true });
      } catch (error) {
          console.error("Error saving time spent:", error);
      }
    }
  }, [user, projectName, totalCount]);

  // Load state from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrompt = localStorage.getItem('starterPrompt');
      if (savedPrompt) setStarterPrompt(savedPrompt);

      const savedConsole = localStorage.getItem('looper-console');
      if (savedConsole) setConsoleEntries(JSON.parse(savedConsole));
      
      const savedHistory = localStorage.getItem('looper-history');
      if (savedHistory) setPromptHistory(JSON.parse(savedHistory));
    }
  }, []);

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

  const addToHistory = (prompt: string) => {
    if (!prompt.trim()) return;
    const newEntry = {
      prompt,
      timestamp: Date.now(),
    };
    setPromptHistory(prev => [newEntry, ...prev.slice(0, 49)]);
  };

  const handleStart = () => {
    if (isLoading) return;
    const willBeRunning = !isRunning;
    setIsRunning(willBeRunning);
    if (isPaused) setIsPaused(false);
  
    if (willBeRunning) {
      addToHistory(starterPrompt);
      setSessionCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
  
      setStatusText('Processing...');
      setIsThinking(true);
      const newEntry = { timestamp: Date.now(), level: 'log', message: `Autopilot starting with prompt: ${starterPrompt.substring(0, 50)}...` };
      setConsoleEntries(prev => [newEntry, ...prev]);
  
      // Special handling for full scan prompt
      if (starterPrompt === fullScanPrompt) {
        setStatusText('Auditing, waiting, scanning...');
        fullScanTimeoutRef.current = setTimeout(() => {
          // Check if still running and not paused before re-triggering
          if (isRunningRef.current && !isPausedRef.current) {
            setConsoleEntries(prev => [{ timestamp: Date.now(), level: 'log', message: 'Scan complete. Re-initiating scan...' }, ...prev]);
            handleStart(); // Re-call to loop
          }
        // Use a 60-second delay as specified in the prompt's "Buffer" section
        }, 60000); 
      } else {
        // Standard non-looping behavior
        setTimeout(() => {
          if (isRunningRef.current) {
            setStatusText('Task Complete');
            setIsThinking(false);
          }
        }, 3000);
      }
    } else {
      // This is the 'Stop' action
      setStatusText('Stopped');
      setIsThinking(false);
      if (fullScanTimeoutRef.current) {
        clearTimeout(fullScanTimeoutRef.current);
        fullScanTimeoutRef.current = null;
      }
      saveTimeSpent();
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
            // If no doc, initialize counts in Firestore
            setTimeSpent(0);
            setTotalCount(0);
            await setDoc(docRef, { timeSpent: 0, totalCount: 0 });
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
  
    return () => {
      unsubscribe();
      if (isRunningRef.current) {
        saveTimeSpent();
      }
      // Cleanup timeout on component unmount
      if (fullScanTimeoutRef.current) {
        clearTimeout(fullScanTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);


  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const { message, filename, lineno, colno, error } = event;
      const fullMessage = `Uncaught Error: ${message} at ${filename}:${lineno}:${colno}`;
      
      const newErrorEntry = {
        timestamp: Date.now(),
        level: 'error',
        message: fullMessage,
        stack: error?.stack,
      };
      setConsoleEntries(prev => [newErrorEntry, ...prev]);
      
      const newIssueEntry = {
        type: 'error',
        message: fullMessage,
      };
      setIssues(prev => [newIssueEntry, ...prev]);

      return true;
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeSpent(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // Save state to local storage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('starterPrompt', starterPrompt);
      localStorage.setItem('looper-console', JSON.stringify(consoleEntries));
      localStorage.setItem('looper-history', JSON.stringify(promptHistory));
    }
  }, [starterPrompt, consoleEntries, promptHistory]);

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

  const handleTabClick = (tabId: string) => {
    playTabBeep();
    if (tabId === 'full-scan') {
        setStarterPrompt(fullScanPrompt);
        addToHistory(fullScanPrompt);
        const newEntry = { timestamp: Date.now(), level: 'log', message: 'Loaded Full Application Scan prompt.' };
        setConsoleEntries(prev => [newEntry, ...prev]);
        setActiveTab(null); // Don't keep the tab open
        return;
    }
    const newActiveTab = activeTab === tabId ? null : tabId;
    setActiveTab(newActiveTab);
  };
  
  const handleDevToolsSubTabChange = (value: string) => {
    setActiveDevToolsTab(value);
    if (value === 'sitemap') {
      handleGenerateSitemap();
    }
    if (value === 'audit') {
      handleAuditPrompt();
    }
  }


  const handlePause = () => {
    if(isRunning) {
        const willBePaused = !isPaused;
        setIsPaused(willBePaused);
        if(willBePaused) {
          setStatusText('Paused');
          setIsThinking(false);
          saveTimeSpent();
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

  const handleInjectPrompt = async () => {
    addToHistory(starterPrompt);
    const newEntry = { timestamp: Date.now(), level: 'api', message: `Injecting prompt: ${starterPrompt.substring(0, 50)}...` };
    setConsoleEntries(prev => [newEntry, ...prev]);
    try {
      const result = await extractUICommands({ prompt: starterPrompt, targetTextareaId: 'starterPrompt' });
      setConsoleEntries(prev => [{ timestamp: Date.now(), level: 'api', message: `Injection result: ${result.result}` }, ...prev]);
    } catch (error) {
      console.error("Error injecting prompt:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setConsoleEntries(prev => [{ timestamp: Date.now(), level: 'error', message: `Injection failed: ${errorMessage}` }, ...prev]);
    }
  };

  const clearConsole = () => setConsoleEntries([]);

  const exportConsole = () => {
    if (typeof window === 'undefined') return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(consoleEntries, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `console-log-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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


  const getTabsConfig = (projectName: string) => ({
    left: [
       { id: 'devtools', icon: Terminal, title: "DevTools", description: "View console logs and captured issues.", iconClassName: "text-slate-400", children: (
        <div className="w-full h-full flex flex-col text-left">
          <Tabs defaultValue={activeDevToolsTab} onValueChange={handleDevToolsSubTabChange} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            </TabsList>
            <TabsContent value="console" className="flex-grow mt-0">
               <div className="w-full h-full flex flex-col text-left">
                  <div className="flex gap-2 my-2">
                    <Button size="sm" variant="ghost" onClick={clearConsole} className="text-xs text-slate-300 hover:bg-slate-700"><Trash2 className="mr-1 h-3 w-3" /> Clear</Button>
                    <Button size="sm" variant="ghost" onClick={exportConsole} className="text-xs text-slate-300 hover:bg-slate-700"><Upload className="mr-1 h-3 w-3" /> Export</Button>
                  </div>
                  <div className="flex-grow bg-slate-900/50 rounded-md p-2 text-xs font-mono overflow-y-auto">
                    {consoleEntries.length === 0 && <div className="text-slate-500">Console is empty.</div>}
                    {consoleEntries.slice(0, 100).map((entry, index) => (
                      <div key={index} className="flex items-start gap-2 text-slate-400">
                        <span className="text-slate-500">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                        <span className={cn('whitespace-pre-wrap break-all', entry.level === 'log' && 'text-slate-300', entry.level === 'api' && 'text-cyan-400', entry.level === 'error' && 'text-red-400', entry.level === 'warning' && 'text-yellow-400')}>[{entry.level}] {entry.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
            </TabsContent>
            <TabsContent value="issues" className="flex-grow mt-0">
              <div className="w-full h-full flex flex-col text-left">
                <div className="flex-grow bg-slate-900/50 rounded-md p-2 text-xs font-mono overflow-y-auto">
                  {issues.length === 0 && <div className="text-slate-500">Monitoring for issues in real-time...</div>}
                  {issues.map((issue, index) => (
                      <div key={index} className={cn("flex items-start gap-2 p-1 rounded", issue.type === 'info' && 'bg-blue-900/30 text-blue-300', issue.type === 'warning' && 'bg-yellow-900/30 text-yellow-300', issue.type === 'error' && 'bg-red-900/30 text-red-300')}>
                        <div className="font-bold uppercase">{issue.type}</div>
                        <div>{issue.message}</div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="audit" className="flex-grow mt-0">
              <div className="w-full h-full flex flex-col text-left p-2">
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
                {!isAuditing && !auditResult && (
                  <div className="text-slate-400">Click this tab to analyze the current prompt.</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="sitemap" className="flex-grow mt-0">
              <div className="w-full h-full flex flex-col text-left p-2">
                <div className="flex-grow bg-slate-900/50 rounded-md p-2 text-xs font-mono overflow-y-auto flex items-center justify-center">
                  {isScanningSitemap && (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader className="animate-spin h-8 w-8" />
                      <span>Scanning Project...</span>
                    </div>
                  )}
                  {!isScanningSitemap && sitemap && sitemap.length === 0 && <div>No pages found.</div>}
                  {!isScanningSitemap && sitemap && sitemap.length > 0 && (
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
                  {!isScanningSitemap && !sitemap && (
                    <div className="text-slate-400 text-center">Click this tab to scan the current page for navigable links.</div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) },
    ],
    right: [
      { id: 'full-scan', icon: Bot, title: "Full Scan", description: `Injects a full application scan prompt.`, iconClassName: "text-primary" },
      { id: 'history', icon: FileClock, title: "History", description: `View prompt history for '${projectName}'.`, iconClassName: "text-accent", children: (
          <div className="w-full h-full flex flex-col text-left">
            <h4 className="text-lg font-semibold text-white mb-2">Prompt History</h4>
            <div className="flex-grow bg-slate-900/50 rounded-md p-2 text-xs font-mono overflow-y-auto">
              {promptHistory.length === 0 && <div className="text-slate-500">No history yet.</div>}
              {promptHistory.map((entry, index) => (
                <div key={index} className="mb-2 p-2 rounded bg-slate-800/50 cursor-pointer hover:bg-slate-700/50" onClick={() => setStarterPrompt(entry.prompt)}>
                  <div className="text-slate-400 text-xs mb-1">[{new Date(entry.timestamp).toLocaleString()}]</div>
                  <div className="text-white truncate">{entry.prompt}</div>
                </div>
              ))}
            </div>
          </div>
      )},
      { id: 'time', icon: Clock, title: "Time Management", description: `Track time spent on the '${projectName}' project.`, iconClassName: "text-yellow-500", children: (
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
  });

  const TABS = getTabsConfig(projectName);

  const renderTabs = (tabData: Omit<TabProps, 'onClick' | 'onMouseEnter' | 'isActive' | 'consoleCount' | 'issueCount'>[]) => 
    tabData.map(tab => 
      <Tab {...tab} 
        key={tab.id}
        onClick={handleTabClick} 
        onMouseEnter={playTabHoverBeep} 
        isActive={activeTab === tab.id}
        consoleCount={tab.id === 'devtools' ? consoleEntries.length : undefined}
        issueCount={tab.id === 'devtools' ? issues.length : undefined}
        className={cn(
          (tab.id === 'devtools') && activeTab === tab.id && "w-96 h-[450px]",
          (tab.id === 'history') && activeTab === tab.id && "w-80 h-96",
          (tab.id !== 'devtools' && tab.id !== 'history') && activeTab === tab.id && "w-96 h-52",
        )}
      />
    );

  const handleOutsideClick = () => {
    if (activeTab) {
      setActiveTab(null);
    }
  };

  return (
      <div 
        className={cn("relative grid grid-cols-[auto_1fr_auto] grid-rows-1 gap-5 items-center justify-items-center p-5 transform scale-90", className)}
        onClick={handleOutsideClick}
      >
          {/* Left */}
          <div className="col-start-1 flex flex-col gap-5 justify-self-end">
            {renderTabs(TABS.left)}
          </div>
          
          {/* Center */}
          <div className="col-start-2">
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
          <div className="col-start-3 flex flex-col gap-5 justify-self-start">
            {renderTabs(TABS.right)}
          </div>
      </div>
  );
};
