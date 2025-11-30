# Texts with the Machine

A static site generator for displaying AI chat logs from [context-assistant/sde](https://github.com/context-assistant/sde) in a chat client-style interface. Mostly vibe coded with Astro, React, and Tailwind CSS.

## Features

- 📱 **Chat Client UI**: Modern chat interface with message bubbles
- 🔍 **Searchable Sessions**: Fuzzy search through all chat sessions
- 🎨 **Light/Dark Mode**: Automatic theme switching based on system preferences
- 🤖 **Agent Cards**: Display agent metadata including name, personality, and communication style
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **GitHub Pages Deployment**: Automatic deployment via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/context-assistant/texts-with-the-machine.git
cd texts-with-the-machine
```

2. Install dependencies:
```bash
npm install
```

3. Add your chat logs to the `logs/` directory as JSON files.

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321/texts-with-the-machine`

### Building

Build the static site:
```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Adding Chat Logs

Simply drop JSON log files from [context-assistant/sde](https://github.com/context-assistant/sde) into the `logs/` directory. Add agentName, communicationStyle, and previewText to enusre those settings are displayed correctly. The system will automatically:

1. Parse each log file
2. Extract session metadata (agent name, personality, communication style)
3. Generate a static page for each session
4. Add the session to the searchable sidebar

### Log File Format

The system expects JSON files with the following structure:

```json
{
  "requestId": "...",
  "timestamp": 1234567890,
  "entry": {
    "id": "session-id",
    "modelName": "model-name",
    "agentName": "Goldblum",
    "personality": "whimsical",
    "previewText": "The Ballad of Bartholomew (the Pumpkin King)",
    "communicationStyle": "Stammer when really excited or surprised",
    "systemPrompt": "Role: ...\nPersonality:\n- personality\nCommunication:\n- style",
    "metadata": {
      "messages": [
        {
          "role": "user",
          "content": "User message"
        },
        {
          "role": "assistant",
          "content": "AI response",
          "agentName": "Agent Name"
        }
      ]
    }
  }
}
```

### Styling

The project uses Tailwind CSS with custom CSS variables for theming. You can customize colors and styles in:

- `src/styles/globals.css` - Theme variables and global styles
- Component files - Individual component styles using Tailwind classes

### Semantic Class Names

The following semantic class names are available for easy customization:

- `.app-container` - Main application container
- `.sidebar-wrapper` - Sidebar container wrapper
- `.session-picker` - Session list sidebar
- `.session-search` - Search input area
- `.main-view` - Main content area
- `.chat-view` - Chat view container
- `.agent-card-header` - Agent information header
- `.chat-messages-container` - Scrollable messages container
- `.chat-messages-list` - Messages list (constrained to 800px)
- `.chat-bubble-row` - Individual message row
- `.chat-bubble-content` - Message bubble
- `.chat-bubble-user` - User message bubble
- `.chat-bubble-ai` - AI message bubble

## Advanced Configuration

### Agent Profiles

You can define detailed agent profiles to be displayed in the UI. Create a JSON file in `src/agents/` (e.g., `src/agents/my-agent.json`):

```json
{
  "name": "Agent Name",
  "communicationStyle": "Description of how they talk",
  "modelName": "model-name",
  "description": "A brief bio or description",
  "image": "images/agent-avatar.jpg"
}
```

Place the corresponding image in `public/images/`.

### Featured Quotes

The landing page displays random quotes from your sessions. To add quotes, create a JSON file in `src/quotes/` (e.g., `src/quotes/highlights.json`):

```json
[
  {
    "quote": "The profound thing the agent said...",
    "sessionId": "1234567890-session-id"
  }
]
```

The `sessionId` links the quote to the specific chat session.

## License

MIT


