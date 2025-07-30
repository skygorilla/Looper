'use server';

/**
 * @fileOverview Audits UI commands of a webpage for accessibility, usability, and best practices.
 *
 * - auditUICommands - A function that handles the UI command auditing process.
 * - AuditUICommandsInput - The input type for the auditUICommands function.
 * - AuditUICommandsOutput - The return type for the auditUICommands function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuditUICommandsInputSchema = z.object({
  html: z
    .string()
    .describe('The HTML content of the webpage to audit.'),
});
export type AuditUICommandsInput = z.infer<typeof AuditUICommandsInputSchema>;

const AuditUICommandsOutputSchema = z.object({
  auditResults: z.string().describe('The audit results for accessibility, usability, and best practices.'),
});
export type AuditUICommandsOutput = z.infer<typeof AuditUICommandsOutputSchema>;

export async function auditUICommands(input: AuditUICommandsInput): Promise<AuditUICommandsOutput> {
  return auditUICommandsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'auditUICommandsPrompt',
  input: {schema: AuditUICommandsInputSchema},
  output: {schema: AuditUICommandsOutputSchema},
  prompt: `You are an expert UI/UX auditor.

You will analyze the provided HTML content of a webpage and audit its UI commands (buttons, links, forms, etc.) for accessibility, usability, and best practices.
Provide detailed findings and recommendations.

HTML Content:
{{{html}}}`,
});

const auditUICommandsFlow = ai.defineFlow(
  {
    name: 'auditUICommandsFlow',
    inputSchema: AuditUICommandsInputSchema,
    outputSchema: AuditUICommandsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
