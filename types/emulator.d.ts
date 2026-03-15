declare module 'typescript-gameboy-emulator' {
  export interface CPUState {
    pc: number;
    sp: number;
    reg: {
      a: number;
      b: number;
      c: number;
      d: number;
      e: number;
      f: number;
      h: number;
      l: number;
      m: number;
      t: number;
    };
    ime: boolean;
    halted: boolean;
    step(): void;
    reset(): void;
  }

  export interface MMUState {
    rom: Uint8Array;
    ram: Uint8Array;
    intf: number;
    inte: number;
    rb(addr: number): number;
    wb(addr: number, val: number): void;
  }

  export interface GPUState {
    vram: Uint8Array;
    oam: Uint8Array;
    reg: Uint8Array;
    canvas: CanvasRenderingContext2D | null;
    screen: ImageData | { width: number, height: number, data: Uint8ClampedArray } | null;
    ly: number;
    reset(): void;
  }

  export interface JoypadState {
    buttons: number;
    directions: number;
    init(): void;
    keyDown(code: string): boolean;
    keyUp(code: string): boolean;
  }

  export interface EmulatorState {
    init(): void;
    loadRom(rom: Uint8Array): Promise<boolean>;
    run(rom: Uint8Array): Promise<void>;
    loop(): void;
    _rafId: number;
  }

  export const cpu: CPUState;
  export const mmu: MMUState;
  export const gpu: GPUState;
  export const joypad: JoypadState;
  export const emulator: EmulatorState;
  export const log: {
    out(tag: string, msg: string): void;
  };
}
