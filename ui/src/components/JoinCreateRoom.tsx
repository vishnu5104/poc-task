import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const JoinCreateRoom = ({ uuid, setUser, setRoomJoined }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.dark("Please enter your name!");

    setUser({
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    });
    setRoomJoined(true);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinName) return toast.dark("Please enter your name!");

    setUser({
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    });
    setRoomJoined(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-3xl p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          🎨 Design
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4 text-center">
              ✨ Create Room
            </h2>
            <form onSubmit={handleCreateSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 mb-4 text-white bg-gray-700 border-none rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                className="w-full px-4 py-3 text-white bg-gray-700 border-none rounded-lg outline-none mb-2"
                value={roomId}
                readOnly
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setRoomId(uuid())}
                  className="w-1/2 px-4 py-3 text-sm text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
                >
                  🔄 Generate
                </button>
                <CopyToClipboard
                  text={roomId}
                  onCopy={() => toast.success("Room ID Copied!")}
                >
                  <button
                    type="button"
                    className="w-1/2 px-4 py-3 text-sm text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
                  >
                    📋 Copy
                  </button>
                </CopyToClipboard>
              </div>
              <button
                type="submit"
                className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
              >
                🚀 Create Room
              </button>
            </form>
          </div>

          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-400 mb-4 text-center">
              ✅ Join Room
            </h2>
            <form onSubmit={handleJoinSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 mb-4 text-white bg-gray-700 border-none rounded-lg outline-none focus:ring-2 focus:ring-green-400"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Room ID"
                className="w-full px-4 py-3 mb-4 text-white bg-gray-700 border-none rounded-lg outline-none focus:ring-2 focus:ring-green-400"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
              />
              <button
                type="submit"
                className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
              >
                🔗 Join Room
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
