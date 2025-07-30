"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ShieldCheck, Layers3, Gauge, Play, StopCircle, Power, Settings, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"
import { auditUICommands } from '@/ai/flows/audit-ui-commands';
import { extractUICommands } from '@/ai/flows/extract-ui-commands';

const TABS_CONFIG = [
  { id: 'extract', label: 'Extract UI', icon: Code2, angle: -45, subTabs: [
    { id: 'extract-all', label: 'Extract All', icon: Settings, action: 'extract' },
    { id: 'extract-buttons', label: 'Buttons Only', icon: Settings },
    { id: 'extract-forms', label: 'Forms Only', icon: Settings },
  ]},
  { id: 'audit', label: 'Audit UI', icon: ShieldCheck, angle: 45, subTabs: [
    { id: 'audit-a11y', label: 'Accessibility', icon: Settings, action: 'audit' },
    { id: 'audit-ux', label: 'Usability', icon: Settings },
    { id: 'audit-bp', label: 'Best Practices', icon: Settings },
  ]},
  { id: 'analyze', label: 'Analyze', icon: Layers3, angle: 135, subTabs: [
    { id: 'analyze-patterns', label: 'Patterns', icon: Settings },
    { id: 'analyze-arch', label: 'Architecture', icon: Settings },
    { id: 'analyze-cohesion', label: 'Cohesion', icon: Settings },
  ]},
  { id: 'perf', label: 'Performance', icon: Gauge, angle: 225, subTabs: [
    { id: 'perf-lcp', label: 'LCP', icon: Settings },
    { id: 'perf-fid', label: 'FID', icon: Settings },
    { id: 'perf-cls', label: 'CLS', icon: Settings },
  ]},
];

const LooperPanel = () => {
  const [expandedTab, setExpandedTab] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [targetStatus, setTargetStatus] = useState<'READY' | 'NOT_FOUND'>('NOT_FOUND');
  const [lcdMessage, setLcdMessage] = useState('SYSTEM BOOTING...');
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      const target = document.getElementById('starterPrompt');
      setTargetStatus(target ? 'READY' : 'NOT_FOUND');
    }, 2000);
    setLcdMessage('SYSTEM READY');
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tabId: string) => {
    setExpandedTab(prev => (prev === tabId ? null : tabId));
  };

  const handleSubTabClick = async (action?: string) => {
    if (isAutomationRunning) {
      toast({ title: "Automation in progress", description: "Please wait for the current task to complete.", variant: "destructive" });
      return;
    }
    const textarea = document.getElementById('starterPrompt') as HTMLTextAreaElement;
    if (!textarea) {
        toast({ title: "Target not found", description: "Could not find textarea with id 'starterPrompt'.", variant: "destructive" });
        return;
    }

    setIsAutomationRunning(true);
    
    if (action === 'extract') {
        setLcdMessage('EXTRACTING UI...');
        try {
            const result = await extractUICommands({ prompt: "Extract all UI commands from the page.", targetTextareaId: 'starterPrompt' });
            textarea.value = result.result;
            setLcdMessage('EXTRACTION COMPLETE');
            toast({ title: "Extraction Complete", description: "UI commands extracted." });
        } catch (error) {
            console.error("Extraction error:", error);
            setLcdMessage('EXTRACTION FAILED');
            toast({ title: "Extraction Failed", variant: "destructive" });
        }
    } else if (action === 'audit') {
        setLcdMessage('AUDITING UI...');
        try {
            const html = document.documentElement.outerHTML;
            const result = await auditUICommands({ html });
            textarea.value = result.auditResults;
            setLcdMessage('AUDIT COMPLETE');
            toast({ title: "Audit Complete", description: "UI audit results are ready." });
        } catch (error) {
            console.error("Audit error:", error);
            setLcdMessage('AUDIT FAILED');
            toast({ title: "Audit Failed", variant: "destructive" });
        }
    } else if (action) {
      setLcdMessage(`RUNNING ${action.toUpperCase()}...`);
      setTimeout(() => {
        setLcdMessage('TASK COMPLETE');
        setIsAutomationRunning(false);
        toast({ title: "Action completed", description: `${action} has finished.` });
      }, 3000);
      return;
    }
    
    setIsAutomationRunning(false);
  };

  const centerRadius = 132; // 396 / 2 - 64 / 2
  const subTabRadius = 48;

  const renderStatus = () => {
    const isReady = targetStatus === 'READY';
    return (
      <div className="flex items-center gap-2">
        <span className={cn("text-xs font-bold", isReady ? 'text-green-400' : 'text-red-500')}>
          {isReady ? 'READY' : 'NO TARGET'}
        </span>
        <div className={cn("w-2 h-2 rounded-full", isReady ? 'bg-green-400 animate-pulse' : 'bg-red-500')}></div>
      </div>
    );
  };

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      <AnimatePresence>
        {isPanelVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Central LCD Display */}
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-black/80 backdrop-blur-sm border-2 border-primary/50 flex flex-col items-center justify-center text-center p-4 shadow-2xl shadow-primary/20 animate-glow">
                <div className="font-code text-primary text-lg leading-none">
                    {isAutomationRunning ? <LoaderCircle className="animate-spin h-8 w-8 text-primary" /> : lcdMessage}
                </div>
                <div className="absolute top-4">{renderStatus()}</div>
                <div className="absolute bottom-6 flex gap-4">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-green-500/20 hover:bg-green-500/40 text-green-400" onClick={() => handleSubTabClick(expandedTab || undefined)}>
                      <Play className="w-5 h-5"/>
                  </Button>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400" onClick={() => setIsAutomationRunning(false)}>
                      <StopCircle className="w-5 h-5"/>
                  </Button>
                </div>
            </Card>

            {/* Main Tabs */}
            {TABS_CONFIG.map((tab, i) => {
              const angleRad = (tab.angle * Math.PI) / 180;
              const x = centerRadius * Math.cos(angleRad);
              const y = centerRadius * Math.sin(angleRad);
              return (
                <div key={tab.id}>
                  <motion.div
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    }}
                  >
                    <Button
                      variant="default"
                      size="icon"
                      className="w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-primary/40 focus:scale-110 focus:shadow-primary/40"
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <tab.icon className="w-8 h-8" />
                    </Button>
                  </motion.div>

                  {/* Sub Tabs */}
                  <AnimatePresence>
                  {expandedTab === tab.id && tab.subTabs.map((subTab, j) => {
                    const subAngle = (j - 1) * 35; // Fan out sub-tabs
                    const finalAngle = (tab.angle + subAngle) * Math.PI / 180;
                    const subX = (centerRadius + subTabRadius) * Math.cos(finalAngle);
                    const subY = (centerRadius + subTabRadius) * Math.sin(finalAngle);
                    
                    return (
                        <motion.div
                            key={subTab.id}
                            className="absolute top-1/2 left-1/2"
                            initial={{ scale: 0, opacity: 0, x: x-subX, y: y-subY }}
                            animate={{ scale: 1, opacity: 1, x: subX, y: subY, transition: { delay: j * 0.05, type: 'spring', stiffness: 300, damping: 20 } }}
                            exit={{ scale: 0, opacity: 0, x: x-subX, y: y-subY, transition: { duration: 0.2 } }}
                            style={{
                                transform: `translate(-50%, -50%)`,
                            }}
                        >
                            <Button
                                variant="secondary"
                                size="icon"
                                className="w-10 h-10 rounded-full shadow-md"
                                onClick={() => handleSubTabClick(subTab.action)}
                                title={subTab.label}
                            >
                                <subTab.icon className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <Button variant="ghost" size="icon" className="absolute w-12 h-12 rounded-full" onClick={() => setIsPanelVisible(!isPanelVisible)}>
        <Power className={cn("w-6 h-6", isPanelVisible ? "text-primary" : "text-muted-foreground")} />
      </Button>
    </div>
  );
};

export default LooperPanel;
