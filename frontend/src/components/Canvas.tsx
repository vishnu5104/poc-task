import React, { useEffect, useLayoutEffect, useState, RefObject } from "react";
import rough from "roughjs";

type ElementType = "rect" | "line" | "pencil";

type Element = {
  offsetX: number;
  offsetY: number;
  width?: number;
  height?: number;
  path?: [number, number][];
  stroke: string;
  element: ElementType;
};

type CanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>;
  color: string;
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
  elements: Element[];
  tool: ElementType;
  socket: any;
};

const generator = rough.generator();

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");

    if (context) {
      context.strokeWidth = 5;
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = color;
      context.lineWidth = 5;
      ctx.current = context;
    }
  }, []);

  useEffect(() => {
    if (ctx.current) ctx.current.strokeStyle = color;
  }, [color]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx.current) return;
    const roughCanvas = rough.canvas(canvas);
    const context = ctx.current;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image if exists
    if (backgroundImage) {
      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    elements.forEach((ele) => {
      if (ele.element === "rect" && ele.width && ele.height) {
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "line" && ele.width && ele.height) {
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "pencil" && ele.path) {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });

    const canvasImage = canvas.toDataURL();
    socket.emit("drawing", canvasImage);
  }, [elements, backgroundImage]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
        },
      ]);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: color, element: tool },
      ]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    setElements((prevElements) =>
      prevElements.map((ele, index) =>
        index === elements.length - 1
          ? {
              ...ele,
              width:
                tool === "rect" || tool === "line"
                  ? offsetX - ele.offsetX
                  : ele.width,
              height:
                tool === "rect" || tool === "line"
                  ? offsetY - ele.offsetY
                  : ele.height,
              path:
                tool === "pencil"
                  ? [...(ele.path || []), [offsetX, offsetY]]
                  : ele.path,
            }
          : ele
      )
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setBackgroundImage(img);
    };
  };

  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px" }}
    >
      {/* File Upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Canvas Wrapper */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {/* Canvas */}
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
