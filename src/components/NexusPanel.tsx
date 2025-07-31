'use client';

import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Folder,
  Save,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Knob = ({
  label,
  value,
  className,
}: {
  label?: string;
  value?: string;
  className?: string;
}) => (
  <div className={cn('flex flex-col items-center gap-1', className)}>
    <div className="relative h-10 w-10 rounded-full border-2 border-slate-300 bg-white shadow-inner-md">
      <div
        className="absolute h-full w-full transform-gpu transition-transform"
        style={{ transform: 'rotate(145deg)' }}
      >
        <div className="absolute left-1/2 top-0 h-2/5 w-[3px] -translate-x-1/2 rounded-full bg-slate-500"></div>
      </div>
    </div>
    {label && (
      <span className="text-[10px] font-semibold uppercase text-slate-500">
        {label}
      </span>
    )}
    {value && (
      <span className="text-xs font-bold text-slate-700">{value}</span>
    )}
  </div>
);

const SmallKnob = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="relative h-7 w-7 rounded-full border-2 border-slate-300 bg-white shadow-inner-sm">
      <div
        className="absolute h-full w-full transform-gpu transition-transform"
        style={{ transform: 'rotate(-45deg)' }}
      >
        <div className="absolute left-1/2 top-0 h-2/5 w-0.5 -translate-x-1/2 rounded-full bg-slate-500"></div>
      </div>
    </div>
    {label && (
      <span className="text-[9px] font-medium uppercase text-slate-500">
        {label}
      </span>
    )}
  </div>
);

const Fader = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="h-16 w-1.5 rounded-full bg-slate-700 p-0.5">
      <div className="h-1/3 w-full rounded-full bg-blue-400"></div>
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
          <Folder size={16} /> LIBRARY
        </div>
        <div className="text-center text-lg font-bold">NEXUS</div>
        <div className="flex items-center justify-end gap-1 text-cyan-300/80">
          ARPEGGIATOR <div className="h-3 w-3 rounded-full bg-slate-600" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-4 font-code text-sm">
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <ChevronRight size={16} /> All Categories
            </li>
            <li className="flex items-center gap-2 text-cyan-100/70">
              <ChevronRight size={16} /> Arpeggios
            </li>
            <li className="flex items-center gap-2 text-cyan-100/70">
              <ChevronRight size={16} /> Bass
            </li>
            <li className="flex items-center gap-2 bg-blue-500/20 text-white">
              <ChevronRight size={16} />{' '}
              <span className="font-bold">Fantasy and Dream</span>
            </li>
            <li className="flex items-center gap-2 text-cyan-100/70">
              <ChevronRight size={16} /> Gated Pads
            </li>
            <li className="flex items-center gap-2 text-cyan-100/70">
              <ChevronRight size={16} /> Lead
            </li>
          </ul>
          <ul className="space-y-1">
            <li className="text-cyan-100/70">AR Crystal Dream</li>
            <li className="text-cyan-100/70">AR Fairytale</li>
            <li className="bg-blue-500/20 text-white">PD Walking into The Dark</li>
            <li className="text-cyan-100/70">PL Angelic</li>
            <li className="text-cyan-100/70">PL Glass Bells</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-t-slate-600/50 pt-2 font-mono">
        <div className="flex items-center gap-2 text-sm">
          <div className="rounded bg-slate-700 px-2 py-1">
            <span>PD: Walking into The Dark</span>
          </div>
          <Badge variant="secondary">reverb</Badge>
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
              Nexus 5
            </h1>
            <Badge variant="outline">Walking into The Dark</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight size={20} />
            </Button>
            <span className="text-sm font-semibold">Master</span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2.5fr_1fr] gap-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 rounded-md border-2 border-slate-300 bg-slate-200/70 p-4">
            <div className="text-center">
              <h2 className="font-bold">MODULATION</h2>
            </div>
            <div className="flex flex-1 flex-col justify-around">
              <Knob label="MOD.DEPTH" />
              <Knob label="MOD.SPEED" />
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
              <h2 className="font-bold">AMP.MODIFIER</h2>
            </div>
            <div className="flex flex-1 flex-col justify-around">
              <Knob label="PAN" />
              <Knob label="VOLUME" />
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

        <div className="grid grid-cols-[1.5fr_3fr] gap-4 rounded-md border-2 border-t-4 border-slate-300 bg-slate-200/70 p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-center font-bold">FILTER MOD</h3>
            <div className="grid grid-cols-3 justify-items-center gap-y-2 rounded-md border-2 border-slate-300 bg-slate-100 p-2">
              <SmallKnob label="ATTACK" />
              <SmallKnob label="DECAY" />
              <SmallKnob label="SUSTAIN" />
              <SmallKnob label="RELEASE" />
              <SmallKnob label="CUTOFF" />
              <SmallKnob label="RESO" />
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-center font-bold">DELAY</h3>
              <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-2 rounded-md border-2 border-slate-300 bg-slate-100 p-2">
                <SmallKnob label="MIX" />
                <SmallKnob label="FDBACK" />
                <SmallKnob label="TIME" />
                <SmallKnob label="MOD" />
                <SmallKnob label="PAN" />
                <SmallKnob label="LOWCUT" />
                <SmallKnob label="HIGHCUT" />
                <div />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-center font-bold">REVERB</h3>
              <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-2 rounded-md border-2 border-slate-300 bg-slate-100 p-2">
                <SmallKnob label="MIX" />
                <SmallKnob label="DECAY" />
                <SmallKnob label="SIZE" />
                <SmallKnob label="MOD" />
                <SmallKnob label="PAN" />
                <SmallKnob label="LOWCUT" />
                <SmallKnob label="HIGHCUT" />
                <div />
              </div>
            </div>
            <div className="flex h-full items-center gap-4 pl-4">
              <Fader label="OUTPUT" />
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
