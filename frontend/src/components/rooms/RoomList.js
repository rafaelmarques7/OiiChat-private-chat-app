import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const formatDate = (timestamp) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, options);
};

const RoomInfo = ({ room }) => {
  const navigate = useNavigate();

  const { _id, roomName, timestamp } = room;
  const strParticipants = `${room?.numParticipants || 1} users (${
    room?.numOnlineParticipants || 0
  } online now)`;

  return (
    <div
      onClick={() => navigate(`/rooms/${_id}`)}
      className="public-rooms-item"
    >
      <div className="public-rooms-item-date">- {formatDate(timestamp)} -</div>
      <div className="public-rooms-item-title">{roomName}</div>
      <div className="public-rooms-item-participants">{strParticipants}</div>
    </div>
  );
};

export const RoomsList = ({ rooms, label = "Title" }) => {
  return (
    <div className="public-rooms-container">
      <div className="public-rooms-title">{label}</div>

      <div className="public-rooms-list">
        {rooms.map((room) => (
          <RoomInfo key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};
