# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Technology Stack

This is a **hybrid mobile application** built with:
- **Svelte 4** + TypeScript for the frontend
- **Vite** as the build tool and development server  
- **Capacitor 7** for iOS/Android mobile deployment
- **Tauri** for desktop application deployment
- **TailwindCSS** + **DaisyUI** for styling
- **Firebase** for analytics and crashlytics

## Development Commands

```bash
# Start development server (runs on port 1440)
npm run dev

# Build for production
npm run build

# Type checking and Svelte validation  
npm run check

# Preview production build
npm run preview

# Tauri desktop development and build commands
npm run tauri dev
npm run tauri build
```

## Mobile Development

For iOS/Android development using Capacitor:
```bash
# Sync web assets to native platforms
npx cap sync

# Open iOS project in Xcode
npx cap open ios

# Open Android project in Android Studio  
npx cap open android

# Build and run on device
npx cap run ios
npx cap run android
```

## Architecture Overview

The application follows a **component-based architecture** with clear separation of concerns:

### Core Structure
- **`src/main.ts`** - Application entry point, initializes router and auth
- **`src/App.svelte`** - Root Svelte component
- **`src/libs/Router/`** - Custom router implementation with route guards
- **`src/stores/`** - Svelte stores for global state management
- **`src/helpers/`** - Utility functions (auth, websocket, validation, etc.)

### Application Layers
- **Views** (`src/views/`) - Main page components (Home, Login, Profile, etc.)
- **Layouts** (`src/layouts/`) - Page layout wrappers (Auth, Main)
- **Components** (`src/components/`) - Reusable UI components
- **Routes** (`src/routes/`) - Route definitions, guards, and view mappings

### Key Systems
- **Authentication** - Token-based auth with websocket integration (`helpers/auth.ts`)
- **State Management** - Centralized stores for user data, events, filters, etc.
- **Routing** - Custom router with layout support and route guards
- **API Integration** - Query functions in `src/queries/` handle server communication
- **Real-time Updates** - WebSocket connection for live data (`helpers/websocket.ts`)

### Mobile-Specific Features
- Capacitor plugins for camera, push notifications, device info
- Safe area handling for iOS/Android
- Haptic feedback support
- ML Kit barcode scanning
- Firebase integration for analytics and crash reporting

## Important Configuration

- **Vite config** resolves `@/` to `src/` directory
- **Capacitor** builds to `build/` directory (not `dist/`)
- **Development server** runs on port 1440 with mobile device support
- **App updates** handled by Capgo Capacitor Updater plugin