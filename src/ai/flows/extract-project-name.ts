'use server';
/**
 * @fileOverview Extracts a project name from the HTML of a webpage.
 *
 * - extractProjectName - A function that handles the project name extraction process.
 * - ExtractProjectNameInput - The input type for the extractProjectName function.
 * - ExtractProjectNameOutput - The return type for the extractProjectName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractProjectNameInputSchema = z.object({
  html: z
    .string()
    .describe('The HTML content of the webpage to analyze.'),
});
export type ExtractProjectNameInput = z.infer<typeof ExtractProjectNameInputSchema>;

const ExtractProjectNameOutputSchema = z.object({
  projectName: z.string().describe('The extracted project name. If none is found, should be "Unknown Project".'),
});
export type ExtractProjectNameOutput = z.infer<typeof ExtractProjectNameOutputSchema>;

export async function extractProjectName(input: ExtractProjectNameInput): Promise<ExtractProjectNameOutput> {
  return extractProjectNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractProjectNamePrompt',
  input: {schema: ExtractProjectNameInputSchema},
  output: {schema: ExtractProjectNameOutputSchema},
  prompt: `You are an expert at analyzing webpage HTML to find the primary project, workspace, or document name.
Analyze the provided HTML content and identify the most likely project name.

Look for patterns like:
- Obvious headings (<h1>, <h2>)
- Breadcrumbs
- Elements with classes like 'project-name', 'workspace-name', 'title', etc.
- The content of the <title> tag.

Based on your analysis of the HTML below, extract the project name.

HTML Content:
{{{html}}}`,
});

const extractProjectNameFlow = ai.defineFlow(
  {
    name: 'extractProjectNameFlow',
    inputSchema: ExtractProjectNameInputSchema,
    outputSchema: ExtractProjectNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
