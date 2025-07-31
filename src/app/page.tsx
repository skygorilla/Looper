'use client';

import { LooperAutopilotAdvanced } from '@/components/LooperAutopilotAdvanced';
import { useState } from 'react';

export default function Home() {
  const [starterPrompt, setStarterPrompt] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-transparent">
      <LooperAutopilotAdvanced 
        starterPrompt={starterPrompt}
        setStarterPrompt={setStarterPrompt}
      />
    </main>
  );
}
