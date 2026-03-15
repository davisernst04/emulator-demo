declare module 'typescript-gameboy-emulator' {
  export interface CPUState {
    pc: number;
    sp: number;
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    h: number;
    l: number;
    f: number;
    ime: boolean;
    halted: boolean;
  }

  export interface MMUState {
    rom: Uint8Array;
    ram: Uint8Array;
  }

  export class GameBoyEmulator {
    cpu: CPUState;
    mmu: MMUState;
    
    constructor();
    step(): void;
    reset(): void;
    loadROM(rom: Uint8Array): void;
    getCPUState(): CPUState;
    getMMUState(): MMUState;
  }
}