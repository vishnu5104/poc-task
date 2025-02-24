"use client";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { useEffect, useRef } from "react";

import { fabric } from "fabric";
export const Editor = () => {
  const { init } = useEditor();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });
  }, [init]);
  return (
    <div className="h-full flex">
      <div className="flex-1 h-full bg-muted" ref={containerRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
