'use server';

/**
 * @fileOverview Extracts the chat history from the page HTML to make the agent aware of the conversation.
 *
 * - extractChatHistory - A function that analyzes the page's HTML to extract the conversation.
 * - ExtractChatHistoryInput - The input type for the extractChatHistory function.
 * - ExtractChatHistoryOutput - The return type for the extractChatHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractChatHistoryInputSchema = z.object({
  html: z
    .string()
    .describe('The HTML content of the webpage to analyze for chat history.'),
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
  prompt: `You are an expert at analyzing webpage HTML to extract conversation histories.
Analyze the provided HTML content and extract the chat messages between the 'user' and the 'prototyper'.

Look for elements with class names like '_chatMessages_...', '_chatMessage_...', and '_isUser_...'.
- Identify messages from the user (containing '_isUser_...') and from the prototyper.
- Extract the text content of each message.
- Construct a structured history of the conversation.

Based on your analysis of the HTML below, generate the structured chat history output.

HTML Content:
\`\`\`html
{{{html}}}
\`\`\`
`,
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
