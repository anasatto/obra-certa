"use client";
import React, { useRef, useState } from "react";

interface Props {
  onConfirm: (base64Image: string) => void;
}

export default function SignatureCanvas({ onConfirm }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onConfirm(canvas.toDataURL("image/png"));
    }
  };

  return (
    <div className="card shadow-sm p-3 border-0 mx-auto" style={{ maxWidth: "400px" }}>
      <p className="fw-semibold text-secondary text-center mb-2">
        <i className="bi bi-pencil-fill me-1"></i> Assine com o dedo abaixo:
      </p>
      <div className="border border-2 border-warning rounded bg-white mb-3" style={{ touchAction: "none" }}>
        <canvas
          ref={canvasRef}
          width={320}
          height={160}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-100"
        />
      </div>
      <div className="d-flex gap-2">
        <button type="button" onClick={clear} className="btn btn-outline-secondary w-50">
          <i className="bi bi-eraser me-1"></i> Limpar
        </button>
        <button type="button" onClick={handleSave} className="btn btn-warning text-dark fw-bold w-50">
          <i className="bi bi-check-circle me-1"></i> Confirmar
        </button>
      </div>
    </div>
  );
}