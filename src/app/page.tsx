'use client';

import { LooperAutopilotAdvanced } from '@/components/LooperAutopilotAdvanced';
import { useEffect, useState } from 'react';

export default function Home() {
  const [projectName, setProjectName] = useState('Looper');

  // This is a placeholder for how you might get the project name.
  // In a real app, this could come from the URL, an API call, or user input.
  useEffect(() => {
    // Example: You could derive the project name from the URL
    // const pathSegments = window.location.pathname.split('/');
    // if (pathSegments.length > 2 && pathSegments[1] === 'projects') {
    //   setProjectName(pathSegments[2]);
    // }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b1e] bg-gradient-to-br from-[#1a1b1e] via-[#2d3748] to-[#1a1b1e]">
      <LooperAutopilotAdvanced projectName={projectName} />
    </main>
  );
}
