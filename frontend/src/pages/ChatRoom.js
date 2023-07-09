import React, { useState, useEffect, useRef } from "react";
import { socket } from "../lib/socket";
import { loadUserDetails, updateRoomInfo } from "../lib/utils";
import { Navigation } from "../components/navigation";
import { useParams } from "react-router-dom";
import { ContainerMessages } from "../components/messages/ContainerMessages";
import { URL_BACKEND } from "../config";
import { RoomInfo } from "../components/rooms/RoomInfo";

export const PageChatRoom = () => {
  const { roomId } = useParams();
  const { userData } = loadUserDetails();

  const [roomName, setRoomName] = useState("");
  const [visibility, setVisibility] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [participantIds, setParticipantIds] = useState([]);
  const [onlineParticipantIds, setOnlineParticipantIds] = useState([]);

  const [username, setUsername] = useState(userData?.username || "");
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );

  const [usersInRoom, setUsersInRoom] = useState([]);

  // run once on page load
  useEffect(() => {
    console.log("running page load effect.");

    const { userData } = loadUserDetails();
    socket.emit("joinRoom", roomId, userData);

    const savedUser = userData?.username;
    const savedPass = localStorage.getItem("password");
    console.log("getting user preferences from local storage", {
      savedUser,
      savedPass,
    });

    if (savedUser) setUsername(savedUser);
    if (savedPass) setPassword(savedPass);

    // 2 - get room info from server
    const getRoomInfo = async () => {
      try {
        const url = `${URL_BACKEND}/rooms/${roomId}`;
        console.log("fetching room info from url: ", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("result: ", res.status, res);
        if (res.status === 200) {
          const { roomName, visibility, ownerId } = await res.json();

          console.log("setting rooms: ", { roomName, visibility, ownerId });
          setRoomName(roomName);
          setVisibility(visibility);
          setOwnerId(ownerId);
        }
      } catch (e) {
        console.log("error fetching room info: ", e);
      }
    };
    getRoomInfo();

    const handleBeforeUnload = () => {
      socket.emit("eventRoomLeave", roomId, userData);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const onEventNewRoomInfo = (data) => {
      console.log("received eventNewRoomInfo: ", data);
      const { participantIds, onlineParticipantIds } = data;

      if (participantIds && onlineParticipantIds) {
        setParticipantIds(participantIds);
        setOnlineParticipantIds(onlineParticipantIds);
      }
    };
    socket.on("eventNewRoomInfo", onEventNewRoomInfo);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("eventNewRoomInfo", onEventNewRoomInfo);
    };
  }, []);

  // run when password or username changes
  useEffect(() => {
    console.log("saving user preferences to local storage", {
      username,
      password,
    });

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
  }, [username, password]);

  console.log("rendering chat page: ", {
    username,
    roomName,
    visibility,
    ownerId,
    userData,
    isOwner: String(ownerId) === String(userData?._id),
    participantIds,
    onlineParticipantIds,
  });

  const handleUpdateRoomName = async (val) => {
    console.log("update room name, ", val);
    setRoomName(val);

    const res = await updateRoomInfo(roomId, { roomName: val });
    if (!res) {
      // @todo: handle error
      console.log("error updating room info");
    }
  };

  return (
    <div className="chatroom-container">
      <Navigation />

      <RoomInfo
        isOwner={ownerId === userData?._id}
        visibility={visibility}
        roomName={roomName}
        handleUpdateRoomName={handleUpdateRoomName}
        password={password}
        handleUpdatePassword={setPassword}
      />

      <ContainerMessages password={password} username={username} />
    </div>
  );
};
