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
    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-border bg-card shadow-inner-md text-foreground">
      <Settings size={20} />
    </Button>
    {label && (
      <span className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </span>
    )}
  </div>
);

const SmallSwitch = ({ label }: { label?: string }) => (
    <div className="flex flex-col items-center gap-1">
       <Switch id={label?.toLowerCase().replace(' ','-')} />
      {label && (
        <Label htmlFor={label?.toLowerCase().replace(' ','-')} className="text-xs font-medium uppercase text-muted-foreground">
          {label}
        </Label>
      )}
    </div>
  );

const Screen = () => (
  <div className="h-56 w-full max-w-md rounded-md border-2 border-border bg-background p-3 text-primary shadow-inner-lg">
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-3 items-center border-b border-b-border/50 pb-1 font-mono text-xs">
        <div className="flex items-center gap-1 text-primary/80">
          <Folder size={14} /> Looper
        </div>
        <div className="text-center font-bold">LOOPER</div>
        <div className="flex items-center justify-end gap-1 text-primary/80">
          Looper <div className="h-3 w-3 rounded-full bg-muted" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-4 font-code text-xs">
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <ChevronRight size={14} /> Looper Item
            </li>
            <li className="flex items-center gap-2 text-primary/70">
              <ChevronRight size={14} /> Looper Item
            </li>
            <li className="flex items-center gap-2 bg-primary/20 text-white">
              <ChevronRight size={14} />{' '}
              <span className="font-bold">Looper Item</span>
            </li>
            <li className="flex items-center gap-2 text-primary/70">
              <ChevronRight size={14} /> Looper Item
            </li>
          </ul>
          <ul className="space-y-1">
            <li className="text-primary/70">Looper Text</li>
            <li className="text-primary/70">Looper Text</li>
            <li className="bg-primary/20 text-white">Looper Text</li>
            <li className="text-primary/70">Looper Text</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-t-border/50 pt-2 font-mono">
        <div className="flex items-center gap-2 text-xs">
          <div className="rounded bg-muted px-2 py-1">
            <span>Looper Text</span>
          </div>
          <Badge variant="secondary">looper</Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Copy size={14} className="text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Save size={14} className="text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export function NexusPanel() {
  return (
    <Card className="w-full max-w-4xl bg-card/80 p-4 font-sans text-card-foreground shadow-xl backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b-2 border-b-border pb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold uppercase tracking-wider">
              Looper
            </h1>
            <Badge variant="outline">Looper Text</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight size={20} />
            </Button>
            <span className="text-sm font-semibold">Looper</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2.5fr_1fr] gap-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 rounded-md border-2 border-border bg-card/70 p-4">
            <div className="text-center">
              <h2 className="text-sm font-bold">CONTROL SECTION</h2>
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

          <div className="flex flex-col items-center justify-between gap-4 rounded-md border-2 border-border bg-card/70 p-4">
            <div className="text-center">
              <h2 className="text-sm font-bold">CONTROL SECTION</h2>
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

        <div className="grid grid-cols-[1.5fr_3fr] gap-4 rounded-md border-t-4 border-border bg-card/70 p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm text-center font-bold">CONTROL SECTION</h3>
            <div className="grid grid-cols-3 justify-items-center gap-y-4 rounded-md border-2 border-border bg-background p-2">
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
              <h3 className="text-sm text-center font-bold">CONTROL SECTION</h3>
              <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-4 rounded-md border-2 border-border bg-background p-2">
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
              <h3 className="text-sm text-center font-bold">CONTROL SECTION</h3>
              <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-4 rounded-md border-2 border-border bg-background p-2">
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
              
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
