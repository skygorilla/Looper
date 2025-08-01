'use client';

import { LooperAutopilotAdvanced } from '@/components/LooperAutopilotAdvanced';
import { useEffect, useState } from 'react';
import { extractProjectName } from '@/ai/flows/extract-project-name';

export default function Home() {
  const [projectName, setProjectName] = useState<string | undefined>(undefined);

  // In an extension context, get the project name from the page's HTML.
  useEffect(() => {
    async function fetchProjectName() {
      if (typeof window !== 'undefined' && document.body) {
        setIsLoading(true);
        try {
          const bodyHtml = document.body.outerHTML;
          const result = await extractProjectName({ html: bodyHtml });
          setProjectName(result.projectName || window.location.hostname || "Unknown Project");
        } catch (error) {
          console.error("Error extracting project name:", error);
          // Fallback to hostname if AI fails
          setProjectName(window.location.hostname || "Unknown Project");
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchProjectName();
  }, []);

  // Add a loading state to manage the async operation
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1a1b1e] bg-gradient-to-br from-[#1a1b1e] via-[#2d3748] to-[#1a1b1e]">
      {isLoading ? (
         <div className="text-white">Analyzing page to find project name...</div>
      ) : projectName ? (
        <LooperAutopilotAdvanced projectName={projectName} />
      ) : (
        <div className="text-white">Could not determine project name.</div>
      )}
    </main>
  );
}
