export const RoomParticipants = ({ participants, onlineUsers }) => {
  const numP = participants?.length > 1 ? participants.length : 1;
  const numO = onlineUsers?.length > 1 ? onlineUsers.length : 1;

  return (
    <div className="room-participants-container">
      <p>
        {numP} users ({numO} online)
      </p>
    </div>
  );
};
