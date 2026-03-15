# GameBoy Emulator Demo

A Next.js demo application showcasing the `typescript-gameboy-emulator` package.

## Features

- 🎮 Interactive CPU state visualization (all registers: A, B, C, D, E, F, H, L, PC, SP)
- 💾 MMU state display (ROM/RAM info)
- 🎛️ Interactive controls: Step, Run, Stop, Reset, Load Test ROM
- 📟 Console log showing emulator events
- 🎨 Dark themed, visually polished UI with Tailwind CSS + shadcn/ui
- 📱 Responsive design

## Tech Stack

- Next.js 16 + React + TypeScript
- Tailwind CSS
- shadcn/ui components
- typescript-gameboy-emulator

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Package Integration

This demo imports the emulator dynamically:

```typescript
const { GameBoyEmulator } = await import("typescript-gameboy-emulator");
const emu = new GameBoyEmulator();
```

If the package fails to load, it gracefully falls back to a mock emulator for demonstration purposes.

## Controls

- **Step**: Execute a single instruction
- **Run/Stop**: Start/stop continuous execution
- **Reset**: Reset emulator to initial state
- **Load Test ROM**: Load a sample ROM with test instructions