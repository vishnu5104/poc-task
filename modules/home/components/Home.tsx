import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "../modals/NotFound";

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f9fa";
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer, failed) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on("joined", handleJoinedRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId) socket.emit("join_room", roomId, username);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800">Digiboard</h1>
        <p className="text-lg text-gray-500">
          Real-time collaborative whiteboard
        </p>

        <div className="mt-6 text-left">
          <label className="block font-semibold text-gray-700">
            Enter your name
          </label>
          <input
            className="mt-2 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 15))}
          />
        </div>

        <div className="my-6 border-t border-gray-300"></div>

        <form onSubmit={handleJoinRoom} className="w-full">
          <label className="block font-semibold text-gray-700">
            Enter room ID
          </label>
          <input
            className="mt-2 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Room ID..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Join Room
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="w-full border-t border-gray-300"></span>
          <span className="px-3 text-gray-500">or</span>
          <span className="w-full border-t border-gray-300"></span>
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
        >
          Create New Room
        </button>
      </div>
    </div>
  );
};

export default Home;
