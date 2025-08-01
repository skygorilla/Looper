'use server';

/**
 * @fileOverview Generates a sitemap from the HTML of a webpage.
 *
 * - generateSitemap - A function that handles the sitemap generation process.
 * - GenerateSitemapInput - The input type for the generateSitemap function.
 * - GenerateSitemapOutput - The return type for the generateSitemap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSitemapInputSchema = z.object({
  html: z
    .string()
    .describe('The HTML content of the webpage to analyze.'),
});
export type GenerateSitemapInput = z.infer<typeof GenerateSitemapInputSchema>;

const SitemapEntrySchema = z.object({
    path: z.string().describe("The relative or absolute path of the page."),
    title: z.string().describe("The title of the page."),
    description: z.string().describe("A brief description of the page's purpose."),
});

const GenerateSitemapOutputSchema = z.object({
  sitemap: z.array(SitemapEntrySchema).describe('An array of pages found in the HTML, representing the sitemap.'),
});
export type GenerateSitemapOutput = z.infer<typeof GenerateSitemapOutputSchema>;

export async function generateSitemap(input: GenerateSitemapInput): Promise<GenerateSitemapOutput> {
  return generateSitemapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSitemapPrompt',
  input: {schema: GenerateSitemapInputSchema},
  output: {schema: GenerateSitemapOutputSchema},
  prompt: `You are an expert at analyzing webpage HTML to generate a sitemap.
Analyze the provided HTML content and identify all the links that navigate to other pages within the same website or application.

Look for <a> tags, navigation menus (<nav>), lists of links, etc.
For each page you find, extract its path (href attribute), a sensible title (from the link text or surrounding headers), and a brief description.

Based on your analysis of the HTML below, generate the sitemap.

HTML Content:
{{{html}}}`,
});

const generateSitemapFlow = ai.defineFlow(
  {
    name: 'generateSitemapFlow',
    inputSchema: GenerateSitemapInputSchema,
    outputSchema: GenerateSitemapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
