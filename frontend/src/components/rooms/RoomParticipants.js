export const RoomParticipants = ({ participants, onlineUsers }) => {
  return (
    <div className="room-participants-container">
      <p>Participants: {participants.length}</p>
      <p>Online: {onlineUsers.length}</p>
    </div>
  );
};
