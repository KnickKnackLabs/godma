<div align="center">

# godma

**Describe it. Claude builds it in Figma.**

A Figma plugin that turns natural language prompts into slide decks,
powered by Claude.

![lang: TypeScript](https://img.shields.io/badge/lang-TypeScript-3178c6?style=flat&logo=typescript&logoColor=white)
![platform: Figma](https://img.shields.io/badge/platform-Figma-1e1e1e?style=flat&logo=figma&logoColor=white)
![ai: Claude](https://img.shields.io/badge/ai-Claude-d4a27f?style=flat)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

</div>

## How it works

Type a prompt. Godma sends it to Claude, which returns a structured JSON slide deck. The plugin reads that JSON and builds real Figma frames — titles, content slides, bullet lists, split layouts, quotes — all placed on your canvas with proper typography and theming.

No templates. No drag-and-drop. Just describe what you want.

```
"6-slide pitch deck for a pet adoption app called PawMatch. Modern, clean, purple accent."
```

Claude generates the structure and copy. Godma lays it out at 1920x1080 with Inter, accent bars, and proper spacing.

## Layouts

| Layout | What it builds |
| --- | --- |
| `title` | Centered title + subtitle |
| `content` | Title, accent bar, body text |
| `bullets` | Title, accent bar, bullet list |
| `split` | Two-column — accent background left, content right |
| `quote` | Large quote mark, quote text, attribution |
| `blank` | Empty slide with theme background |

## Themes

Three built-in themes, selectable from the UI:

| Theme | Background | Text | Accent |
| --- | --- | --- | --- |
| **Dark** | Near-black | Light gray | Purple |
| **Light** | Off-white | Near-black | Purple |
| **Bold** | Purple | White | Gold |

## Setup

1. Clone and build:

```bash
git clone https://github.com/KnickKnackLabs/godma.git
cd godma && npm install && npm run build
```

2. In Figma desktop, go to **Plugins > Development > Import plugin from manifest** and select `manifest.json` from this repo.

3. Run the plugin, paste your Claude API key, and go.

Your API key is saved locally in Figma's client storage. It never leaves your machine except to call the Anthropic API directly.

## Development

```bash
npm run build     # one-shot build
npm run watch     # rebuild on file changes
```

The build bundles `src/plugin.ts` with esbuild and copies `src/ui.html` to `dist/`.

<div align="center">

## License

MIT

</div>
