import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface ClientRoomProps {
  userNo: number;
  socket: any; // If you have proper types, replace 'any' with `Socket`
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  setUserNo: React.Dispatch<React.SetStateAction<number>>;
}

const ClientRoom: React.FC<ClientRoomProps> = ({
  userNo,
  socket,
  setUsers,
  setUserNo,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    socket.on("message", (data: { message: string }) => {
      toast.info(data.message);
    });

    return () => socket.off("message");
  }, [socket]);

  useEffect(() => {
    socket.on("users", (data: any[]) => {
      setUsers(data);
      setUserNo(data.length);
    });

    return () => socket.off("users");
  }, [socket, setUsers, setUserNo]);

  useEffect(() => {
    socket.on("canvasImage", (data: string) => {
      if (imgRef.current) {
        imgRef.current.src = data;
      }
    });

    return () => socket.off("canvasImage");
  }, [socket]);

  return (
    <div className="container-fluid">
      <div className="row pb-2">
        <h1 className="display-5 pt-4 pb-3 text-center">
          React Drawing App - users online: {userNo}
        </h1>
      </div>
      <div className="row mt-5">
        <div
          className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
          style={{ height: "500px" }}
        >
          <img className="w-100 h-100" ref={imgRef} src="" alt="Canvas" />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
