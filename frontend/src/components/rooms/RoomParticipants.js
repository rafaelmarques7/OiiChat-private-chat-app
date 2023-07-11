export const RoomParticipants = ({ participants, onlineUsers }) => {
  return (
    <div className="room-participants-container">
      <p>Participants: {participants ? participants.length : 0}</p>
      <p>Online: {onlineUsers ? onlineUsers.length : 0}</p>
    </div>
  );
};
