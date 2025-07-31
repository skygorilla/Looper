'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, FileText, Target, CheckCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface PromptTargetDemoProps {
    promptValue: string;
    setPromptValue: (value: string) => void;
}

export const PromptTargetDemo: React.FC<PromptTargetDemoProps> = ({ promptValue, setPromptValue }) => {
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopy = async () => {
    if (!promptValue) return;
    try {
      await navigator.clipboard.writeText(promptValue);
      setCopySuccess(true);
       toast({
        title: "Copied to Clipboard",
        description: "Prompt content has been copied",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
       toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
      console.error('Failed to copy text: ', err);
    }
  };

  const clearPrompt = () => {
    setPromptValue('');
     toast({
      title: "Prompt Cleared",
      description: "Textarea has been cleared",
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="relative">
          <Textarea
            id="starterPrompt"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            placeholder="Prompts will be injected here by the automation tools..."
            className="min-h-32 resize-none font-mono text-sm"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopy}
              disabled={!promptValue}
            >
              {copySuccess ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3" />
            <span>Characters: {promptValue.length}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearPrompt}
            disabled={!promptValue}
            className="h-6 text-xs"
          >
            Clear
          </Button>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Demo Information:</strong> This textarea has the ID "starterPrompt" that the automation tools target. 
            In a real implementation, this would be the prompt input area of your AI application or tool.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
