'use server';

/**
 * @fileOverview Audits UI commands from a prompt to assess potential risk.
 *
 * - auditUICommands - A function that handles the UI command auditing process.
 * - AuditUICommandsInput - The input type for the auditUICommands function.
 * - AuditUICommandsOutput - The return type for the auditUICommands function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuditUICommandsInputSchema = z.object({
  prompt: z
    .string()
    .describe('The prompt containing UI commands to be audited.'),
});
export type AuditUICommandsInput = z.infer<typeof AuditUICommandsInputSchema>;

const AuditUICommandsOutputSchema = z.object({
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed risk level of the commands.'),
  assessment: z.string().describe('A detailed assessment explaining the risks, potential for crashes, or heavy operations.'),
});
export type AuditUICommandsOutput = z.infer<typeof AuditUICommandsOutputSchema>;

export async function auditUICommands(input: AuditUICommandsInput): Promise<AuditUICommandsOutput> {
  return auditUICommandsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'auditUICommandsPrompt',
  input: {schema: AuditUICommandsInputSchema},
  output: {schema: AuditUICommandsOutputSchema},
  prompt: `You are an expert UI automation and web development safety auditor. Analyze the following prompt, which describes a series of actions to be taken on a webpage.

Your task is to assess the potential risk of these actions. Consider the following:
- Destructive actions (e.g., deleting elements, clearing data).
- High-volume operations (e.g., creating hundreds of elements, making many API calls in a loop).
- Complex DOM manipulations that could lead to performance issues or crashes.
- Vague or ambiguous commands that could be misinterpreted.

Based on your analysis, determine a risk level and provide a concise assessment explaining your reasoning.

Prompt to audit:
"{{{prompt}}}"`,
});

const auditUICommandsFlow = ai.defineFlow(
  {
    name: 'auditUICommandsFlow',
    inputSchema: AuditUICommandsInputSchema,
    outputSchema: AuditUICommandsOutputSchema,
  },
  async input => {
    if (!input.prompt?.trim()) {
        return {
            riskLevel: 'Low',
            assessment: 'Prompt is empty. No action will be taken.'
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
