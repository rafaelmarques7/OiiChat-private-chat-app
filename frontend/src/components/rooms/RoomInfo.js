import { FormInput, ReadOnlyInput } from "../FormInput";

export const RoomInfo = ({
  isOwner = false,
  visibility,
  roomName,
  handleUpdateRoomName,
  password,
  isCorrectPassword,
  handleUpdatePassword,
}) => {
  console.log("rendering room info: ", { roomName, visibility, password });
  const itemRoomName = isOwner ? (
    <FormInput
      initialValue={roomName}
      icon={"/img/group.svg"}
      callback={(val) => handleUpdateRoomName(val)}
      tooltipText="Change room name"
    />
  ) : (
    <ReadOnlyInput
      value={roomName}
      icon={"/img/group.svg"}
      callback={(val) => handleUpdateRoomName(val)}
      tooltipText="Change room name"
    />
  );

  const itemVisibility = (
    <ReadOnlyInput
      value={visibility}
      icon={"/img/visibility.svg"}
      tooltipText={`This rooms is ${visibility}`}
    />
  );

  const itemPassword = (
    <FormInput
      initialValue={password}
      value={password}
      disabled={isCorrectPassword}
      icon={"/img/lock.svg"}
      placeholder="Password"
      callback={(val) => handleUpdatePassword(val)}
      tooltipText="Password used to encrypt messages"
    />
  );

  return (
    <div className="chatroom-room-settings-container">
      {itemRoomName}
      {itemVisibility}
      {itemPassword}
    </div>
  );
};
