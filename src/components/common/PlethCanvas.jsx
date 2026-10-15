import React, { useRef, useEffect } from 'react';
import { TelemetryService } from '../../services/TelemetryService';

export const PlethCanvas = ({ heartRate = 80, height = 50, spO2 = 96 }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const sweepXRef = useRef(0);
  const dataPointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const h = canvas.height;
    const baselineY = h * 0.85;

    if (dataPointsRef.current.length === 0) {
      dataPointsRef.current = new Array(width).fill(baselineY);
    }

    let lastTime = performance.now();
    let phase = 0;

    const render = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const beatsPerSecond = heartRate / 60;
      phase = (phase + dt * beatsPerSecond) % 1.0;

      const sample = TelemetryService.getPlethSample(phase);
      const currentY = baselineY - sample * (h * 0.65);

      const sweepSpeed = 2;
      const currentX = sweepXRef.current;

      for (let i = 0; i < sweepSpeed; i++) {
        const x = (currentX + i) % width;
        dataPointsRef.current[x] = currentY;
      }

      sweepXRef.current = (currentX + sweepSpeed) % width;

      // Draw Background
      ctx.fillStyle = "#08141E";
      ctx.fillRect(0, 0, width, h);

      // Grid
      ctx.strokeStyle = "rgba(2, 136, 209, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Draw Pleth Wave
      ctx.strokeStyle = "#0288D1";
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      ctx.beginPath();

      const clearGap = 16;
      const head = sweepXRef.current;

      for (let x = 0; x < width; x++) {
        if (x >= head && x < head + clearGap) continue;

        const y = dataPointsRef.current[x] || baselineY;
        if (x === 0 || x === head + clearGap) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = "#64748B";
      ctx.font = "9px JetBrains Mono, monospace";
      ctx.fillText(`PLETH SpO2 ${spO2}%`, 8, 12);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [heartRate, spO2]);

  return (
    <div className="relative w-full rounded-sm overflow-hidden border border-[#1E2638]">
      <canvas
        ref={canvasRef}
        width={420}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
};
