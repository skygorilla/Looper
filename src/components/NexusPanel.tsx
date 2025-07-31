'use client';

import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Folder,
  Settings,
  Save,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ControlButton = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center gap-2">
    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-slate-300 bg-white shadow-inner-md">
      <Settings size={20} />
    </Button>
    {label && (
      <span className="text-[10px] font-semibold uppercase text-slate-500">
        {label}
      </span>
    )}
  </div>
);

const SmallSwitch = ({ label }: { label?: string }) => (
    <div className="flex flex-col items-center gap-1">
       <Switch id={label?.toLowerCase().replace(' ','-')} />
      {label && (
        <Label htmlFor={label?.toLowerCase().replace(' ','-')} className="text-[9px] font-medium uppercase text-slate-500">
          {label}
        </Label>
      )}
    </div>
  );

const FaderControl = ({ label }: { label?: string }) => (
    <div className="flex flex-col items-center gap-1">
        <div className="h-20 w-2 rounded-full bg-slate-300 relative">
            <Button className="h-4 w-4 rounded-full bg-blue-400 absolute" style={{top: '33%', left: '-6px'}}/>
        </div>
        {label && (
          <span className="text-[10px] font-semibold uppercase text-slate-500">
            {label}
          </span>
        )}
      </div>
);

const Screen = () => (
  <div className="h-56 w-full max-w-md rounded-md border-2 border-slate-300 bg-slate-800 p-3 text-cyan-300 shadow-inner-lg">
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-3 items-center border-b border-b-slate-600/50 pb-1 font-mono text-sm">
        <div className="flex items-center gap-1 text-cyan-300/80">
          <Folder size={16} /> Placeholder
        </div>
        <div className="text-center text-lg font-bold">PLACEHOLDER</div>
        <div className="flex items-center justify-end gap-1 text-cyan-300/80">
          Placeholder <div className="h-3 w-3 rounded-full bg-slate-600" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-4 font-code text-sm">
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <ChevronRight size={16} /> Placeholder Item
            </li>
            <li className="flex items-center gap-2 text-cyan-100/70">
              <ChevronRight size={16} /> Placeholder Item
            </li>
            <li className="flex items-center gap-2 bg-blue-500/20 text-white">
              <ChevronRight size={16} />{' '}
              <span className="font-bold">Placeholder Item</span>
            </li>
            <li className="flex items-center gap-2 text-cyan-100/70">
              <ChevronRight size={16} /> Placeholder Item
            </li>
          </ul>
          <ul className="space-y-1">
            <li className="text-cyan-100/70">Placeholder Text</li>
            <li className="text-cyan-100/70">Placeholder Text</li>
            <li className="bg-blue-500/20 text-white">Placeholder Text</li>
            <li className="text-cyan-100/70">Placeholder Text</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-t-slate-600/50 pt-2 font-mono">
        <div className="flex items-center gap-2 text-sm">
          <div className="rounded bg-slate-700 px-2 py-1">
            <span>Placeholder Text</span>
          </div>
          <Badge variant="secondary">placeholder</Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Copy size={14} className="text-slate-400" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Save size={14} className="text-slate-400" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export function NexusPanel() {
  return (
    <Card className="w-full max-w-4xl bg-slate-100/80 p-4 font-sans text-slate-700 shadow-xl backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b-2 border-b-slate-300 pb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold uppercase tracking-wider">
              Placeholder
            </h1>
            <Badge variant="outline">Placeholder Text</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight size={20} />
            </Button>
            <span className="text-sm font-semibold">Placeholder</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2.5fr_1fr] gap-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 rounded-md border-2 border-slate-300 bg-slate-200/70 p-4">
            <div className="text-center">
              <h2 className="font-bold">CONTROL SECTION</h2>
            </div>
            <div className="flex flex-1 flex-col justify-around">
              <ControlButton label="CONTROL 1" />
              <ControlButton label="CONTROL 2" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="sm" className="w-full">
                <ArrowUp size={16} />
              </Button>
              <Button size="sm" className="w-full">
                <ArrowDown size={16} />
              </Button>
            </div>
          </div>

          <Screen />

          <div className="flex flex-col items-center justify-between gap-4 rounded-md border-2 border-slate-300 bg-slate-200/70 p-4">
            <div className="text-center">
              <h2 className="font-bold">CONTROL SECTION</h2>
            </div>
            <div className="flex flex-1 flex-col justify-around">
              <ControlButton label="CONTROL 3" />
              <ControlButton label="CONTROL 4" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button size="sm" className="w-full">
                <ArrowUp size={16} />
              </Button>
              <Button size="sm" className="w-full">
                <ArrowDown size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1.5fr_3fr] gap-4 rounded-md border-t-4 border-slate-300 bg-slate-200/70 p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-center font-bold">CONTROL SECTION</h3>
            <div className="grid grid-cols-3 justify-items-center gap-y-4 rounded-md border-2 border-slate-300 bg-slate-100 p-2">
              <SmallSwitch label="SWITCH 1" />
              <SmallSwitch label="SWITCH 2" />
              <SmallSwitch label="SWITCH 3" />
              <SmallSwitch label="SWITCH 4" />
              <SmallSwitch label="SWITCH 5" />
              <SmallSwitch label="SWITCH 6" />
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-center font-bold">CONTROL SECTION</h3>
              <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-4 rounded-md border-2 border-slate-300 bg-slate-100 p-2">
                <SmallSwitch label="S1" />
                <SmallSwitch label="S2" />
                <SmallSwitch label="S3" />
                <SmallSwitch label="S4" />
                <SmallSwitch label="S5" />
                <SmallSwitch label="S6" />
                <SmallSwitch label="S7" />
                <div />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-center font-bold">CONTROL SECTION</h3>
              <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-4 rounded-md border-2 border-slate-300 bg-slate-100 p-2">
                <SmallSwitch label="S8" />
                <SmallSwitch label="S9" />
                <SmallSwitch label="S10" />
                <SmallSwitch label="S11" />
                <SmallSwitch label="S12" />
                <SmallSwitch label="S13" />
                <SmallSwitch label="S14" />
                <div />
              </div>
            </div>
            <div className="flex h-full items-center gap-4 pl-4">
              
              <div className="flex h-20 w-8 flex-col justify-between rounded-md border-2 border-slate-300 bg-slate-700 p-1">
                <div className="h-1/3 w-full animate-pulse rounded-sm bg-blue-400" />
                <div className="h-1/4 w-full animate-pulse rounded-sm bg-blue-300" />
                <div className="h-1/2 w-full animate-pulse rounded-sm bg-red-500" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
