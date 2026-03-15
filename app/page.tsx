"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emu, setEmu] = useState<any>(null);

  useEffect(() => {
    const initEmulator = async () => {
      try {
        const emulatorPackage = await import("typescript-gameboy-emulator");
        setEmu(emulatorPackage);
        emulatorPackage.joypad.init();
        if (canvasRef.current) {
          emulatorPackage.gpu.reset();
        }
      } catch (error) {
        console.error("Failed to load emulator package:", error);
      }
    };
    initEmulator();
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && emu) {
      const buffer = await file.arrayBuffer();
      const romData = new Uint8Array(buffer);
      if (emu.emulator._rafId) cancelAnimationFrame(emu.emulator._rafId);
      await emu.emulator.run(romData);
      setIsRunning(true);
    }
  };

  const pressKey = (key: string) => {
    if (emu) {
      emu.joypad.keyDown(key);
    }
  };

  const releaseKey = (key: string) => {
    if (emu) emu.joypad.keyUp(key);
  };

  return (
    <div className="min-h-screen w-screen bg-[#c4c7c0] flex flex-col items-center p-4 md:p-8 lg:p-12 font-sans selection:bg-zinc-500/30 text-[#302058]">
      {/* Handheld Device Container */}
      <div className="w-full max-w-[460px] md:max-w-[360px] lg:max-w-[400px] flex flex-col gap-6 md:gap-6 lg:gap-8 transition-all duration-300">
        {/* Screen Section - Matching GB aspect ratio to eliminate unequal gaps */}
        <div className="w-full">
          <div className="relative w-full aspect-[160/144] bg-black rounded-2xl border-8 border-black shadow-2xl overflow-hidden flex items-center justify-center">
            <canvas
              id="screen"
              ref={canvasRef}
              width="160"
              height="144"
              className="w-full h-full image-render-pixelated opacity-95 contrast-125 bg-black"
            />

            {!isRunning && (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-center p-6 z-20"></div>
            )}
          </div>
        </div>

        {/* Controller Section */}
        <div className="w-full bg-[#c4c7c0] rounded-[40px] border-b-[8px] border-[#9ca3af] shadow-xl p-6 md:p-8 flex flex-col gap-8 md:gap-12">
          <div className="flex justify-between items-center w-full">
            {/* D-Pad */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34%] h-full bg-[#333] rounded-md shadow-md" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[34%] bg-[#333] rounded-md shadow-md" />

              <button
                onMouseDown={() => pressKey("ArrowUp")}
                onMouseUp={() => releaseKey("ArrowUp")}
                onTouchStart={(e) => { e.preventDefault(); pressKey("ArrowUp"); }}
                onTouchEnd={(e) => { e.preventDefault(); releaseKey("ArrowUp"); }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[34%] h-[35%] active:bg-[#444] rounded-t-md z-10"
              />
              <button
                onMouseDown={() => pressKey("ArrowDown")}
                onMouseUp={() => releaseKey("ArrowDown")}
                onTouchStart={(e) => { e.preventDefault(); pressKey("ArrowDown"); }}
                onTouchEnd={(e) => { e.preventDefault(); releaseKey("ArrowDown"); }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[34%] h-[35%] active:bg-[#444] rounded-b-md z-10"
              />
              <button
                onMouseDown={() => pressKey("ArrowLeft")}
                onMouseUp={() => releaseKey("ArrowLeft")}
                onTouchStart={(e) => { e.preventDefault(); pressKey("ArrowLeft"); }}
                onTouchEnd={(e) => { e.preventDefault(); releaseKey("ArrowLeft"); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[35%] h-[34%] active:bg-[#444] rounded-l-md z-10"
              />
              <button
                onMouseDown={() => pressKey("ArrowRight")}
                onMouseUp={() => releaseKey("ArrowRight")}
                onTouchStart={(e) => { e.preventDefault(); pressKey("ArrowRight"); }}
                onTouchEnd={(e) => { e.preventDefault(); releaseKey("ArrowRight"); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[35%] h-[34%] active:bg-[#444] rounded-r-md z-10"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] bg-[#333] rounded-full shadow-inner z-0" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 md:gap-6 shrink-0 rotate-[-25deg] mt-4">
              <div className="flex flex-col items-center gap-3">
                <button
                  onMouseDown={() => pressKey("KeyX")}
                  onMouseUp={() => releaseKey("KeyX")}
                  onTouchStart={(e) => { e.preventDefault(); pressKey("KeyX"); }}
                  onTouchEnd={(e) => { e.preventDefault(); releaseKey("KeyX"); }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-[#8b0000] rounded-full shadow-lg border-b-4 border-black/30 active:shadow-none active:translate-y-1 transition-all"
                />
                <span className="text-[#302058] font-black rotate-[25deg] text-[10px] md:text-xs">
                  B
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  onMouseDown={() => pressKey("KeyZ")}
                  onMouseUp={() => releaseKey("KeyZ")}
                  onTouchStart={(e) => { e.preventDefault(); pressKey("KeyZ"); }}
                  onTouchEnd={(e) => { e.preventDefault(); releaseKey("KeyZ"); }}
                  className="w-14 h-14 md:w-16 md:h-16 bg-[#8b0000] rounded-full shadow-lg border-b-4 border-black/30 active:shadow-none active:translate-y-1 transition-all"
                />
                <span className="text-[#302058] font-black rotate-[25deg] text-[10px] md:text-xs">
                  A
                </span>
              </div>
            </div>
          </div>

          {/* Select/Start Buttons */}
          <div className="flex justify-center gap-10 md:gap-14 rotate-[-20deg]">
            <div className="flex flex-col items-center gap-2">
              <button
                onMouseDown={() => pressKey("ShiftLeft")}
                onMouseUp={() => releaseKey("ShiftLeft")}
                onTouchStart={(e) => { e.preventDefault(); pressKey("ShiftLeft"); }}
                onTouchEnd={(e) => { e.preventDefault(); releaseKey("ShiftLeft"); }}
                className="w-10 h-3.5 md:w-12 md:h-4 bg-[#999] rounded-full shadow-md border-b-2 border-black/20 active:shadow-none active:translate-y-0.5 transition-all"
              />
              <span className="text-[8px] md:text-[10px] font-black text-[#302058] uppercase tracking-tighter">
                Select
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onMouseDown={() => pressKey("Enter")}
                onMouseUp={() => releaseKey("Enter")}
                onTouchStart={(e) => { e.preventDefault(); pressKey("Enter"); }}
                onTouchEnd={(e) => { e.preventDefault(); releaseKey("Enter"); }}
                className="w-10 h-3.5 md:w-12 md:h-4 bg-[#999] rounded-full shadow-md border-b-2 border-black/20 active:shadow-none active:translate-y-0.5 transition-all"
              />
              <span className="text-[8px] md:text-[10px] font-black text-[#302058] uppercase tracking-tighter">
                Start
              </span>
            </div>
          </div>
        </div>

        {/* Load ROM Button */}
        <div className="w-full pb-8 md:pb-12">
          <div className="relative group overflow-hidden rounded-full">
            <input
              type="file"
              accept=".gb,.gbc"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button className="w-full bg-[#8b0000] text-white hover:bg-[#a00000] font-black py-6 md:py-8 text-xs md:text-sm uppercase tracking-widest rounded-full border-b-[6px] border-[#5a0000] transition-all active:border-b-0 active:translate-y-1.5">
              {isRunning ? "Change ROM" : "Load ROM"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
