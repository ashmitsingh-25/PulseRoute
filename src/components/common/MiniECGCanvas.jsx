import React, { useRef, useEffect } from 'react';
import { TelemetryService } from '../../services/TelemetryService';

export const MiniECGCanvas = ({ heartRate = 80, height = 75, isSTEMI = true }) => {
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
    const centerY = h / 2;

    if (dataPointsRef.current.length === 0) {
      dataPointsRef.current = new Array(width).fill(centerY);
    }

    let lastTime = performance.now();
    let phase = 0;

    const render = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const beatsPerSecond = heartRate / 60;
      phase = (phase + dt * beatsPerSecond) % 1.0;

      const voltage = TelemetryService.getECGSample(phase);
      const currentY = centerY - voltage * (h * 0.36);

      const sweepSpeed = 2;
      const currentX = sweepXRef.current;

      for (let i = 0; i < sweepSpeed; i++) {
        const x = (currentX + i) % width;
        dataPointsRef.current[x] = currentY;
      }

      sweepXRef.current = (currentX + sweepSpeed) % width;

      // Dark slate hospital monitor background
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, width, h);

      // Clean subtle grid lines (Hospital telemetry grid)
      ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Crisp hospital green trace
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.beginPath();

      const clearGap = 16;
      const head = sweepXRef.current;

      for (let x = 0; x < width; x++) {
        if (x >= head && x < head + clearGap) continue;

        const y = dataPointsRef.current[x] || centerY;
        if (x === 0 || x === head + clearGap) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Sweep head dot
      ctx.fillStyle = "#34D399";
      ctx.beginPath();
      ctx.arc(head, dataPointsRef.current[head] || centerY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Clinical lead text
      ctx.fillStyle = "#94A3B8";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText("Lead II • 25 mm/s", 10, 16);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [heartRate, isSTEMI]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-sm bg-slate-900">
      <canvas
        ref={canvasRef}
        width={480}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
};
