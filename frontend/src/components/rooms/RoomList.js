import React from "react";
import { Link } from "react-router-dom";

const formatDate = (timestamp) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, options);
};

const RoomInfo = ({ room }) => {
  const { _id, roomName, timestamp } = room;

  return (
    <div className="public-rooms-item">
      <div className="public-rooms-item-date">- {formatDate(timestamp)} -</div>
      <div className="public-rooms-item-title">{roomName}</div>
      <Link to={`/rooms/${_id}`}>
        <button>> Enter Room</button>
      </Link>
    </div>
  );
};

export const RoomsList = ({ rooms }) => {
  return (
    <div className="public-rooms-container">
      <div className="public-rooms-title">Public Rooms</div>

      <div className="public-rooms-list">
        {rooms.map((room) => (
          <RoomInfo key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};
