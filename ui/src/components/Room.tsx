import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "./Canvas";

const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");

  useEffect(() => {
    socket.on("message", (data) => {
      toast.info(data.message);
    });
  }, []);

  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    if (elements.length === 0) return;
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) => prevElements.slice(0, -1));
  };

  const redo = () => {
    if (history.length === 0) return;
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mt-6">🎨 Draw: {userNo}</h1>

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 mt-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <label className="text-lg font-semibold mb-2">
              Color Picker 🎨
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 border-none rounded-lg shadow-md cursor-pointer"
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="text-lg font-semibold mb-2">Select Tool ✏️</label>
            <div className="flex space-x-4">
              {["pencil", "line", "rect"].map((t) => (
                <button
                  key={t}
                  className={`px-4 py-2 rounded-lg transition ${
                    tool === t
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setTool(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-lg font-semibold mb-2">Actions 🔄</label>
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                disabled={elements.length === 0}
                onClick={undo}
              >
                Undo
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
                disabled={history.length === 0}
                onClick={redo}
              >
                Redo
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md"
            onClick={clearCanvas}
          >
            🧹 Clear Canvas
          </button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-4">
        <Canvas
          canvasRef={canvasRef}
          ctx={ctx}
          color={color}
          setElements={setElements}
          elements={elements}
          tool={tool}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Room;
