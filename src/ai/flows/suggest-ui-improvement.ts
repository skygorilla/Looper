'use server';

/**
 * @fileOverview Suggests a UI improvement based on page content and a prompt.
 *
 * - suggestUIImprovement - A function that handles the suggestion process.
 * - SuggestUIImprovementInput - The input type for the suggestUIImprovement function.
 * - SuggestUIImprovementOutput - The return type for the suggestUIImprovement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUIImprovementInputSchema = z.object({
  html: z
    .string()
    .describe('The HTML content of the webpage to analyze.'),
  prompt: z
    .string()
    .describe('The user\'s current prompt or command.'),
});
export type SuggestUIImprovementInput = z.infer<typeof SuggestUIImprovementInputSchema>;

const SuggestUIImprovementOutputSchema = z.object({
  suggestion: z.string().describe('The AI-generated suggestion, framed as an approval request.'),
});
export type SuggestUIImprovementOutput = z.infer<typeof SuggestUIImprovementOutputSchema>;

export async function suggestUIImprovement(input: SuggestUIImprovementInput): Promise<SuggestUIImprovementOutput> {
  return suggestUIImprovementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUIImprovementPrompt',
  input: {schema: SuggestUIImprovementInputSchema},
  output: {schema: SuggestUIImprovementOutputSchema},
  prompt: `You are a senior UI/UX engineer and AI agent. Your goal is to assist a user by analyzing a webpage and their prompt to suggest a single, valuable next step.

Analyze the provided HTML and the user's prompt. Based on this context, formulate a clear and concise suggestion for a UI improvement or refactoring.

Frame your response as an "APPROVAL_REQUEST" that the user can confirm. For example: "APPROVAL_REQUEST: I suggest refactoring the main content into a new component called 'ContentWrapper'. Please confirm to proceed."

User's Prompt: "{{{prompt}}}"

HTML Content:
\`\`\`html
{{{html}}}
\`\`\`
`,
});

const suggestUIImprovementFlow = ai.defineFlow(
  {
    name: 'suggestUIImprovementFlow',
    inputSchema: SuggestUIImprovementInputSchema,
    outputSchema: SuggestUIImprovementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
