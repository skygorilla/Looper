'use server';

/**
 * @fileOverview This flow extracts UI commands from a webpage by injecting a prompt into a textarea.
 *
 * - extractUICommands - A function that injects a prompt into a textarea to extract UI commands.
 * - ExtractUICommandsInput - The input type for the extractUICommands function.
 * - ExtractUICommandsOutput - The return type for the extractUICommands function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractUICommandsInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'The prompt to inject into the textarea to extract UI commands.'
    ),
  targetTextareaId: z
    .string()
    .describe(
      'The ID of the textarea element where the prompt will be injected.'
    ),
});
export type ExtractUICommandsInput = z.infer<typeof ExtractUICommandsInputSchema>;

const ExtractUICommandsOutputSchema = z.object({
  result: z.string().describe('The result of the UI command extraction.'),
});
export type ExtractUICommandsOutput = z.infer<typeof ExtractUICommandsOutputSchema>;

export async function extractUICommands(input: ExtractUICommandsInput): Promise<ExtractUICommandsOutput> {
  return extractUICommandsFlow(input);
}

const extractUICommandsPrompt = ai.definePrompt({
  name: 'extractUICommandsPrompt',
  input: {schema: ExtractUICommandsInputSchema},
  output: {schema: ExtractUICommandsOutputSchema},
  prompt: `Extract all UI commands (buttons, tabs, links, forms) from the HTML of the current webpage. Inject the following prompt into the textarea with ID '{{{targetTextareaId}}}':

  {{prompt}}
  `,
});

const extractUICommandsFlow = ai.defineFlow(
  {
    name: 'extractUICommandsFlow',
    inputSchema: ExtractUICommandsInputSchema,
    outputSchema: ExtractUICommandsOutputSchema,
  },
  async input => {
    // For now, just return a canned output.  Later, we'll need to figure out
    // how to actually inject the prompt into the textarea in the browser.
    const {output} = await extractUICommandsPrompt(input);
    return output!;
  }
);
