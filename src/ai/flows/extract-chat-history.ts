'use server';

/**
 * @fileOverview Represents the Prototyper providing the chat history to the Looper agent.
 *
 * - extractChatHistory - A function that simulates the Prototyper providing the conversation history.
 * - ExtractChatHistoryInput - The input type for the extractChatHistory function.
 * - ExtractChatHistoryOutput - The return type for the extractChatHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractChatHistoryInputSchema = z.object({
  // The HTML is no longer strictly needed but is kept for schema consistency.
  // It represents the context Looper is currently looking at.
  html: z
    .string()
    .describe('The HTML content of the webpage to analyze.'),
});
export type ExtractChatHistoryInput = z.infer<typeof ExtractChatHistoryInputSchema>;

const ChatMessageSchema = z.object({
    author: z.enum(['user', 'prototyper']).describe("Who sent the message."),
    message: z.string().describe("The content of the message."),
});

const ExtractChatHistoryOutputSchema = z.object({
  chatHistory: z.array(ChatMessageSchema).describe('An array of chat messages from the conversation.'),
});
export type ExtractChatHistoryOutput = z.infer<typeof ExtractChatHistoryOutputSchema>;

export async function extractChatHistory(input: ExtractChatHistoryInput): Promise<ExtractChatHistoryOutput> {
  return extractChatHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractChatHistoryPrompt',
  input: {schema: ExtractChatHistoryInputSchema},
  output: {schema: ExtractChatHistoryOutputSchema},
  prompt: `You are the Prototyper, the AI developer assistant. The Looper agent, which is blind to the source code, has requested the recent chat history to get context on the project.

Provide a structured summary of the recent conversation with the user (operator).

Here is the recent history to summarize:
- User asked to add a safety switch.
- Prototyper added a "Settings" tab with a toggle switch.
- User noted that clicking empty space didn't close the tab.
- Prototyper attempted a fix, but the user rolled it back.
- User clarified the high-level goal: Looper should be an autonomous agent that can take over development.
- User asked if Looper can read the Prototyper's feedback.
- Prototyper implemented a "Scan Chat" feature and a "Feedback" tab.
- User clarified the interaction model: User (Operator) -> Looper (Agent) -> Prototyper (Developer). Looper is blind and must ask the Prototyper for information.

Based on this, generate the structured chat history output.`,
});

const extractChatHistoryFlow = ai.defineFlow(
  {
    name: 'extractChatHistoryFlow',
    inputSchema: ExtractChatHistoryInputSchema,
    outputSchema: ExtractChatHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
