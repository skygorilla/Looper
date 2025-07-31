'use client';

import { UIAutomationPanel } from '@/components/UIAutomationPanel';
import { useState } from 'react';

export default function Home() {
  const [starterPrompt, setStarterPrompt] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <UIAutomationPanel
        starterPrompt={starterPrompt}
        setStarterPrompt={setStarterPrompt}
      />
    </main>
  );
}