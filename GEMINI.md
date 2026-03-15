# GEMINI.md - GameBoy Emulator Demo Context

This file provides instructional context for Gemini CLI when working within this repository.

## Project Overview

A high-performance, visually polished Next.js 16 demo application showcasing the `typescript-gameboy-emulator` package. The project provides an interactive dashboard to visualize and control the internal state of a GameBoy emulator.

### Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`)
- **Emulator:** `typescript-gameboy-emulator` (Integrated via dynamic imports)
- **Icons:** Lucide React

### Key Features
- **CPU State Visualization:** Real-time display of registers (A, B, C, D, E, F, H, L, PC, SP) and flags (Z, N, H, C).
- **MMU State Display:** ROM/RAM size and preview of memory contents.
- **Interactive Controls:** Step execution, continuous run/stop, reset, and test ROM loading.
- **Emulator Console:** Event logging for initialization and user actions.
- **Resilient Integration:** Graceful fallback to a mock emulator if the external package fails to load.

## Building and Running

| Task | Command |
| :--- | :--- |
| **Install Dependencies** | `npm install` |
| **Development Server** | `npm run dev` (Runs on [http://localhost:3000](http://localhost:3000)) |
| **Production Build** | `npm run build` |
| **Start Production Server** | `npm run start` |
| **Linting** | `npm run lint` |

## Development Conventions

### Architecture
- **App Router:** Follows the Next.js 16 App Router pattern with `app/layout.tsx` and `app/page.tsx`.
- **Client Components:** The main interactive logic resides in `app/page.tsx` using the `"use client"` directive.
- **Dynamic Imports:** The emulator package is imported dynamically within `useEffect` to ensure compatibility with client-side execution.
- **Type Safety:** External package types are declared in `types/emulator.d.ts`.

### UI & Styling
- **Tailwind CSS 4:** Uses the latest Tailwind version with `@tailwindcss/postcss`.
- **shadcn/ui:** Components like `Button`, `Card`, and `Badge` are used for a consistent, professional look.
- **Utility:** Use the `cn` utility in `lib/utils.ts` for conditional class merging.
- **Theme:** Optimized for a dark-themed, "cyberpunk" aesthetic using zinc/slate grays with high-contrast accent colors.

### Code Style
- **Functional Components:** Prefer functional components with hooks.
- **Memoization:** Use `useCallback` for event handlers passed to interactive elements.
- **Modularity:** UI components are separated into `components/ui/`, while core logic is in `app/`.
- **Hex Formatting:** Address/Value displays should use the `formatHex` helper for consistency (e.g., `0x0100`).
