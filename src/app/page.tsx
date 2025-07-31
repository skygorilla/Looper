import { LooperAutopilotAdvanced } from '@/components/LooperAutopilotAdvanced';
import { PromptTargetDemo } from '@/components/PromptTargetDemo';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start gap-8 p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4 text-center">
          Web Dev Tools Monitor
        </h1>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto">
          An advanced monitoring panel for web development. Use the switches and buttons on the Looper Autopilot to display data and interact with the prompt target below.
        </p>
      </div>
      <div className="flex w-full max-w-7xl flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <LooperAutopilotAdvanced />
        </div>
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <PromptTargetDemo />
        </div>
      </div>
    </main>
  );
}
