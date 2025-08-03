'use client';

import { LooperAutopilotAdvanced } from '@/components/LooperAutopilotAdvanced';
import { useEffect, useState } from 'react';
import { extractProjectName } from '@/ai/flows/extract-project-name';

export default function Home() {
  const [projectName, setProjectName] = useState<string>("Current Project");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b1e] bg-gradient-to-br from-[#1a1b1e] via-[#2d3748] to-[#1a1b1e]">
      <LooperAutopilotAdvanced projectName={projectName} />
    </main>
  );
}
