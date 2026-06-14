# Bishkek Roofing

🌐 Language: **English** | [Русский](README.md)

A landing page for a roofing service in Bishkek. The project presents the company's services, explains the work process, and lets users open an interactive preliminary cost calculator.

## About

The app is a single-page React interface with animated service cards, section navigation, and a quote calculator modal. Users can choose a service type, object area, material/reliability tier, and submit contact details. Created requests are stored locally in the browser with `localStorage` and displayed in a saved estimates section.

## Features

- promotional page for Bishkek Roofing services;
- service cards with images and hover animations;
- work process section;
- modal window for preliminary cost calculation;
- service, area, and reliability tier selection;
- saved quote requests in `localStorage`;
- local saved requests dashboard with delete action;
- responsive desktop and mobile UI.

## Services Shown In The UI

- roof repair;
- roof installation;
- facade works;
- industrial climbing.

## Tech Stack

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS;
- Motion;
- Lucide React.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. If needed, create `.env.local` from `.env.example` and set the environment variables:

   ```bash
   GEMINI_API_KEY="MY_GEMINI_API_KEY"
   APP_URL="MY_APP_URL"
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

4. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Data And Integrations

The quote form does not send data to a server. Requests are stored only in the user's browser through `localStorage`.

The current project version does not define any backend API endpoints. Environment variables from `.env.example` are kept for compatibility with the original AI Studio template.
