'use server';

/**
 * @fileOverview Extracts chat history from the Firebase Studio prototyper UI.
 *
 * - extractChatHistory - A function that handles the chat history extraction process.
 * - ExtractChatHistoryInput - The input type for the extractChatHistory function.
 * - ExtractChatHistoryOutput - The return type for the extractChatHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractChatHistoryInputSchema = z.object({
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
  prompt: `You are an expert at analyzing webpage HTML to extract structured data.
Analyze the provided HTML content and extract the full chat history.

The chat messages are contained within elements that have specific class names.
- The main container for all messages is a div with class '_chatMessages_vnhdv_58'.
- Each individual message is in a div with class '_chatMessage_1xlw2_30'.
- A user message has an additional class: '_isUser_1xlw2_47'.
- An AI prototyper message does not have the '_isUser_1xlw2_47' class.

Iterate through all message elements and build a structured list of the conversation.

HTML Content:
{{{html}}}`,
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
