import React, { useState, useEffect } from "react";
import socket from "../utils/socket";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("rooms", (data) => setRooms(data));
    socket.on("selectedRoom", (data) => setRooms(data));
  }, []);

  const joinRoom = (id) => {
    socket.emit("joinRoom", id);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {rooms.map((el) => (
        <span key={el._id} onClick={() => joinRoom(el._id)}>
          {el._name}
        </span>
      ))}
    </div>
  );
}
