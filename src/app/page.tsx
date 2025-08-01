'use client';

import { LooperAutopilotAdvanced } from '@/components/LooperAutopilotAdvanced';
import { useEffect, useState } from 'react';

export default function Home() {
  const [projectName, setProjectName] = useState<string | undefined>(undefined);

  // In an extension context, get the project name from the page's hostname.
  useEffect(() => {
    // This code only runs on the client side, ensuring window is available.
    if (typeof window !== 'undefined') {
      setProjectName(window.location.hostname || "Unknown Project");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b1e] bg-gradient-to-br from-[#1a1b1e] via-[#2d3748] to-[#1a1b1e]">
      {projectName ? (
        <LooperAutopilotAdvanced projectName={projectName} />
      ) : (
        // You can show a loading spinner or some placeholder here
        <div className="text-white">Loading...</div>
      )}
    </main>
  );
}
