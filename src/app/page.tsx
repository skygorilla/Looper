import LooperPanel from '@/components/looper-panel';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsla(170,65%,51%,0.15),rgba(255,255,255,0))]"></div>
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-7xl">
          <div className="w-full lg:w-1/2 flex items-center justify-center py-10">
              <LooperPanel />
          </div>
          <div className="w-full lg:w-1/2">
              <Card className="w-full bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
                  <CardHeader>
                      <CardTitle className="font-headline">Prompt Target</CardTitle>
                      <CardDescription>The Looper panel will inject prompts into this textarea.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Textarea
                          id="starterPrompt"
                          placeholder="Automation prompts will appear here..."
                          className="h-96 min-h-[300px] font-mono text-sm bg-background/70 focus:bg-background/90 transition-colors duration-300"
                      />
                  </CardContent>
              </Card>
          </div>
      </div>
    </main>
  );
}
