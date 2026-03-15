"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CPUState {
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

interface MMUState {
  rom: Uint8Array;
  ram: Uint8Array;
}

export default function Home() {
  const [emulator, setEmulator] = useState<any>(null);
  const [cpuState, setCpuState] = useState<CPUState | null>(null);
  const [mmuState, setMmuState] = useState<MMUState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    const loadEmulator = async () => {
      try {
        const { GameBoyEmulator } = await import("typescript-gameboy-emulator");
        const emu = new GameBoyEmulator();
        setEmulator(emu);
        addLog("✅ Emulator initialized successfully");
        updateStateFromEmulator(emu);
      } catch (error) {
        addLog(`⚠️ Using mock emulator`);
        const mockEmu = createMockEmulator();
        setEmulator(mockEmu);
        updateStateFromEmulator(mockEmu);
      }
    };
    loadEmulator();
  }, []);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  const updateStateFromEmulator = (emu: any) => {
    if (emu) {
      const cpu = emu.getCPUState?.() || emu.cpu || null;
      const mmu = emu.getMMUState?.() || emu.mmu || null;
      setCpuState(cpu);
      setMmuState(mmu);
    }
  };

  const handleStep = useCallback(() => {
    if (emulator?.step) {
      emulator.step();
      setStepCount((prev) => prev + 1);
      updateStateFromEmulator(emulator);
      addLog("⏭️ Step executed");
    }
  }, [emulator, addLog]);

  const handleRun = useCallback(() => {
    if (emulator) {
      setIsRunning(true);
      addLog("▶️ Running...");
      const interval = setInterval(() => {
        if (emulator.step) {
          emulator.step();
          setStepCount((prev) => prev + 1);
          updateStateFromEmulator(emulator);
        }
      }, 100);
      (emulator as any).runInterval = interval;
    }
  }, [emulator, addLog]);

  const handleStop = useCallback(() => {
    if (emulator?.runInterval) {
      clearInterval(emulator.runInterval);
      emulator.runInterval = null;
      setIsRunning(false);
      addLog("⏹️ Stopped");
    }
  }, [emulator, addLog]);

  const handleReset = useCallback(() => {
    if (emulator?.reset) {
      emulator.reset();
      setStepCount(0);
      setIsRunning(false);
      if (emulator.runInterval) {
        clearInterval(emulator.runInterval);
        emulator.runInterval = null;
      }
      updateStateFromEmulator(emulator);
      addLog("🔄 Reset");
    }
  }, [emulator, addLog]);

  const handleLoadTestROM = useCallback(() => {
    if (emulator) {
      const testROM = new Uint8Array(32768);
      testROM.fill(0x00);
      testROM[0x100] = 0x3E; testROM[0x101] = 0x42;
      testROM[0x102] = 0x06; testROM[0x103] = 0x69;
      
      if (emulator.loadROM) emulator.loadROM(testROM);
      else if (emulator.mmu?.loadROM) emulator.mmu.loadROM(testROM);
      
      setStepCount(0);
      updateStateFromEmulator(emulator);
      addLog("📥 Test ROM loaded");
    }
  }, [emulator, addLog]);

  function createMockEmulator() {
    return {
      cpu: { pc: 0x0100, sp: 0xFFFE, a: 0x01, b: 0x00, c: 0x13, d: 0x00, e: 0xD8, h: 0x01, l: 0x4D, f: 0xB0, ime: false, halted: false },
      mmu: { rom: new Uint8Array(32768), ram: new Uint8Array(8192) },
      step: function() { this.cpu.pc = (this.cpu.pc + 1) & 0xFFFF; this.cpu.a = (this.cpu.a + 1) & 0xFF; },
      reset: function() { this.cpu.pc = 0x0100; this.cpu.a = 0x01; },
      getCPUState: function() { return this.cpu; },
      getMMUState: function() { return this.mmu; },
    };
  }

  const formatHex = (value: number, digits: number = 2) => `0x${value.toString(16).toUpperCase().padStart(digits, '0')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">🎮 TypeScript GameBoy Emulator</h1>
          <p className="text-zinc-400">Interactive demo showcasing CPU and MMU state</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/50 border-zinc-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <span className="text-blue-400">⚡</span> CPU State
                {isRunning && <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Running</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cpuState ? (
                <div className="grid grid-cols-4 gap-3">
                  <RegisterBox label="PC" value={formatHex(cpuState.pc, 4)} color="blue" />
                  <RegisterBox label="SP" value={formatHex(cpuState.sp, 4)} color="blue" />
                  <RegisterBox label="A" value={formatHex(cpuState.a)} color="green" />
                  <RegisterBox label="F" value={formatHex(cpuState.f)} color="green" />
                  <RegisterBox label="B" value={formatHex(cpuState.b)} color="purple" />
                  <RegisterBox label="C" value={formatHex(cpuState.c)} color="purple" />
                  <RegisterBox label="D" value={formatHex(cpuState.d)} color="orange" />
                  <RegisterBox label="E" value={formatHex(cpuState.e)} color="orange" />
                  <RegisterBox label="H" value={formatHex(cpuState.h)} color="pink" />
                  <RegisterBox label="L" value={formatHex(cpuState.l)} color="pink" />
                  <div className="col-span-2 flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs uppercase">Flags</span>
                    <div className="flex gap-1">
                      <FlagBit label="Z" set={!!(cpuState.f & 0x80)} />
                      <FlagBit label="N" set={!!(cpuState.f & 0x40)} />
                      <FlagBit label="H" set={!!(cpuState.f & 0x20)} />
                      <FlagBit label="C" set={!!(cpuState.f & 0x10)} />
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs uppercase">Status</span>
                    <div className="flex gap-2">
                      {cpuState.ime && <Badge className="bg-blue-500/20 text-blue-400 text-xs">IME</Badge>}
                      {cpuState.halted && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">HALT</Badge>}
                    </div>
                  </div>
                </div>
              ) : <div className="text-zinc-500 text-center py-8">Loading CPU state...</div>}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-700 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-white flex items-center gap-2"><span className="text-purple-400">💾</span> MMU State</CardTitle>
            </CardHeader>
            <CardContent>
              {mmuState ? (
                <div className="space-y-4">
                  <MemorySection title="ROM" size={mmuState.rom?.length || 32768} color="blue" preview={mmuState.rom?.slice(0, 16)} />
                  <MemorySection title="RAM" size={mmuState.ram?.length || 8192} color="purple" preview={mmuState.ram?.slice(0, 16)} />
                </div>
              ) : <div className="text-zinc-500 text-center py-8">Loading MMU state...</div>}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-700 backdrop-blur">
          <CardHeader className="pb-3"><CardTitle className="text-xl text-white">🎛️ Controls</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleStep} disabled={!emulator || isRunning} className="bg-blue-600 hover:bg-blue-700 text-white">⏭️ Step</Button>
              <Button onClick={isRunning ? handleStop : handleRun} disabled={!emulator} className={isRunning ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}>{isRunning ? "⏹️ Stop" : "▶️ Run"}</Button>
              <Button onClick={handleReset} disabled={!emulator} variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">🔄 Reset</Button>
              <Button onClick={handleLoadTestROM} disabled={!emulator} variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">📥 Load Test ROM</Button>
            </div>
            <div className="mt-4 text-sm text-zinc-400">Step Count: <span className="text-white font-mono">{stepCount}</span></div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-zinc-700 backdrop-blur">
          <CardHeader className="pb-3"><CardTitle className="text-lg text-zinc-300 font-mono">📟 Console</CardTitle></CardHeader>
          <CardContent>
            <div className="font-mono text-sm space-y-1 max-h-40 overflow-y-auto">
              {logs.length === 0 ? <span className="text-zinc-600">No messages yet...</span> : logs.map((log, i) => <div key={i} className="text-zinc-400">{log}</div>)}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-zinc-500 text-sm">
          <p>Powered by <code className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">typescript-gameboy-emulator</code></p>
        </div>
      </div>
    </div>
  );
}

function RegisterBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    green: "bg-green-500/10 border-green-500/30 text-green-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    orange: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    pink: "bg-pink-500/10 border-pink-500/30 text-pink-400",
  };
  return (
    <div className={`border rounded-lg p-2 ${colors[color]}`}>
      <div className="text-xs uppercase opacity-70">{label}</div>
      <div className="font-mono text-lg font-bold">{value}</div>
    </div>
  );
}

function FlagBit({ label, set }: { label: string; set: boolean }) {
  return <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${set ? "bg-green-500/30 text-green-400" : "bg-zinc-700 text-zinc-500"}`}>{label}</span>;
}

function MemorySection({ title, size, color, preview }: { title: string; size: number; color: string; preview?: Uint8Array }) {
  const formatPreview = (data?: Uint8Array) => data ? Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ') : '';
  return (
    <div className={`border rounded-lg p-3 ${color === 'blue' ? 'border-blue-500/30' : 'border-purple-500/30'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-zinc-300 font-medium">{title}</span>
        <span className="text-zinc-500 text-sm">{size.toLocaleString()} bytes</span>
      </div>
      <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded p-2 truncate">{formatPreview(preview)}...</div>
    </div>
  );
}