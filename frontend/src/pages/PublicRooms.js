import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { URL_GET_PUBLIC_ROOMS } from "../config";
import { Navigation } from "../components/navigation";

const formatDate = (timestamp) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, options);
};

const RoomInfo = ({ room }) => {
  const { _id, roomName, timestamp } = room;

  return (
    <div className="public-rooms-item">
      <div className="public-rooms-item-date">
        Created: {formatDate(timestamp)}
      </div>
      <div className="public-rooms-item-title">{roomName}</div>
      <Link to={`/rooms/${_id}`}>
        <button>> Enter Room</button>
      </Link>
    </div>
  );
};

export const PagePublicRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL_GET_PUBLIC_ROOMS, { mode: "cors" });
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching public rooms:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navigation />
      <div className="public-rooms-container">
        <div className="public-rooms-title">Public Rooms</div>

        <div className="public-rooms-list">
          {rooms.map((room) => (
            <RoomInfo key={room._id} room={room} />
          ))}
        </div>
      </div>
    </>
  );
};
