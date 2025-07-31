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
    null
  );
};
