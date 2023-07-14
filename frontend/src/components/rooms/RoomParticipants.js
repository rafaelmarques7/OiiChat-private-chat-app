export const RoomParticipants = ({ participants, onlineUsers }) => {
  const numP = participants ? participants.length : 1;
  const numO = onlineUsers ? onlineUsers.length : 1;

  return (
    <div className="room-participants-container">
      <p>
        {numP} users ({numO} online)
      </p>
    </div>
  );
};
