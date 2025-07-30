# **App Name**: Looper

## Core Features:

- Tabbed UI Panel: Displays a main panel with dynamically loaded, modular tabs at the edges, and play/stop button at the center.
- Extract UI Commands: Injects a specified prompt into the 'starterPrompt' textarea element to extract UI commands.
- Audit UI Commands: Injects a prompt into the 'starterPrompt' textarea tool to audit UI commands for accessibility and usability.
- Dynamic Tab Loading: Dynamically loads tabs and modules using JavaScript (fetch and insertAdjacentHTML).
- Robust Error Handling: Handles missing elements gracefully and provides error messages.

## Style Guidelines:

- Primary color: Dark slate gray (#374151) for the panel background, providing a professional look. This is very close to black, to evoke a screen background. (#2B2D31)
- Background color: Very dark gray (#1F2937) as a slightly darker shade to provide subtle contrast and depth. Very close to black, to help legibility (#000000 - 10%)
- Accent color: Teal (#2DD4BF) for interactive elements (buttons, tabs) to draw attention. Note: this avoids the user's possible suggestion.
- Body and headline font: 'Inter' (sans-serif) for clear and modern UI text.
- Use simple, line-based icons for the tabs and controls, making sure they remain visible and accessible in the context of the dark background.
- Circular layout for the main panel with round tabs positioned around a central display.
- Subtle animations on tab hover and click, such as scaling or fading, for enhanced interactivity.