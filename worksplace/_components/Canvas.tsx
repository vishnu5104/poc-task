"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw;
  },
  { ssr: false }
);

function Canvas() {
  const [whiteBoardData, setWhiteBoardData] = useState<any>();

  return (
    <div style={{ height: "670px" }}>
      <Excalidraw
        theme="light"
        onChange={(elements) => setWhiteBoardData(elements)}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: false,
            toggleTheme: false,
          },
        }}
      />
    </div>
  );
}

export default Canvas;
