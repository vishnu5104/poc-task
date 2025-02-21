import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => {
      toast.info(data.message);
    });

    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });

    socket.on("canvasImage", (data) => {
      if (imgRef.current) {
        imgRef.current.src = data;
      }
    });

    return () => {
      socket.off("message");
      socket.off("users");
      socket.off("canvasImage");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <h1 className="text-3xl font-bold text-white text-center mt-6">
        🎨 Realtime Drawing App - Users Online: {userNo}
      </h1>

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 mt-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white text-center mb-4">
          Shared Canvas 🖌️
        </h2>

        <div className="flex justify-center">
          <div className="relative w-full max-w-3xl h-[500px] bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-600">
            <img
              ref={imgRef}
              src=""
              alt="Shared Drawing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
