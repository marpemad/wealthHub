# WealthHub v2 - Vite + React Refactor

A modern, componentized portfolio management application built with Vite, React, TypeScript, and Tailwind CSS.

## Quick Start

- **Local Development**: `npm install && npm run dev` → http://localhost:3000
- **Production Build**: `npm run build`
- **Docker/Umbrel**: See [UMBREL.md](UMBREL.md) for installation instructions

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components (Card, Button, Modal, etc.)
│   └── layouts/           # Layout components
├── pages/                 # Page components (Dashboard, History, Bitcoin, etc.)
├── context/              # React Context (WealthContext)
├── hooks/                # Custom React hooks
├── services/             # External services (GAS, PDF export, etc.)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── App.tsx               # Main app component
└── main.tsx              # Entry point
```

## Features

- ✅ **Componentized Architecture**: Modular, reusable components
- ✅ **Global State Management**: Context API with custom hooks
- ✅ **Google Apps Script Integration**: Sync with Google Drive
- ✅ **Dark Mode**: Built-in theme switching
- ✅ **Responsive Design**: Mobile-first with Tailwind CSS
- ✅ **Multi-asset Support**: Assets, Bitcoin, Stocks portfolio management
- ✅ **Compound Interest Projections**: Financial calculations
- ✅ **PDF & JSON Export**: Download backups

## Getting Started

### Environment Configuration

Copy `.env.example` to `.env` and configure your environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

Then edit `.env` with your values:

\`\`\`env
# Google Apps Script URL for data synchronization
VITE_GAS_URL=https://script.google.com/macros/s/YOUR_GAS_SCRIPT_ID/exec
\`\`\`

**Note**: Environment variables must be prefixed with `VITE_` to be exposed to the frontend in Vite.

### Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Development Server

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000 in your browser.

### Build for Production

\`\`\`bash
npm run build
\`\`\`

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Export**: jsPDF
- **Backend**: Google Apps Script

## Architecture

### State Management
- **WealthContext**: Centralized global state management using React Context API
- **Custom Hooks**: 
  - `useROIMetrics`: Calculate ROI for each asset
  - `useCumulativeReturn`: Track cumulative returns over time
  - `useEvolutionData`: Build historical wealth evolution data
- **localStorage**: Persistent storage with keys: `wm_assets_v4`, `wm_history_v4`, `wm_bitcoinTransactions_v4`, `wm_stockTransactions_v4`

### Directory Structure
```
src/
├── components/ui/          # Reusable UI components: Button, Card, Input, Modal, Select, MetricCard
├── pages/                  # Page components: Dashboard, History, Assets, Bitcoin, Stocks, Projections, Statistics
├── context/                # React Context: WealthContext with global state
├── hooks/                  # Custom hooks for calculations
├── services/               # External services: GAS sync, PDF/JSON export
├── types/                  # TypeScript interfaces
├── utils/                  # Utility functions: formatting, UUID generation
├── App.tsx                 # Main app component with tab navigation
└── main.tsx                # Application entry point
```

### Data Sync
- **Primary**: localStorage for immediate persistence
- **Secondary**: Google Apps Script (GAS) for cloud backup via `VITE_GAS_URL` environment variable
- **Automatic**: Changes trigger `saveDataToGAS()` for real-time sync
- **Configuration**: Set `VITE_GAS_URL` in `.env` file to enable cloud sync

### Styling
- **Framework**: Tailwind CSS v3 with custom theme
- **Dark Mode**: Automatic via `.dark` class on root element
- **Responsive**: Mobile-first design with responsive breakpoints (md, lg)
- **Components**: Consistent border-radius (rounded-2xl, rounded-3xl), spacing, and color scheme

## Tips & Best Practices

1. **Adding Features**: New components go in `src/components/ui/`, pages in `src/pages/`
2. **State Updates**: Always trigger through WealthContext functions for GAS sync
3. **Calculations**: Use custom hooks (`useROIMetrics`, etc.) for shared logic
4. **Styling**: Use Tailwind classes consistently; check `tailwind.config.js` for custom values
5. **Type Safety**: Define types in `src/types/index.ts`, import where needed

## Troubleshooting

**Environment variables not loading?**
- Ensure variables are prefixed with `VITE_` in `.env` file
- Restart the development server after changing `.env`
- Variables are read at build time, not runtime

**Data not persisting?**
- Check browser's localStorage (Dev Tools > Application > Storage)
- Verify `VITE_GAS_URL` is correctly configured in `.env`
- Check the browser console for sync errors

**Build failing?**
- Run `npm run build` to check for TypeScript errors
- Ensure all imports use correct file paths
- Verify `VITE_GAS_URL` is defined when building for production

**Styles not applying?**
- Verify class names follow Tailwind syntax
- Check if dark mode is enabled in `App.tsx`

## License

MIT
