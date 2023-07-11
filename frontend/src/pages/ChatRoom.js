import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { loadUserDetails, updateRoomInfo } from "../lib/utils";
import { useParams } from "react-router-dom";
import { ContainerMessages } from "../components/messages/ContainerMessages";
import { RoomInfo } from "../components/rooms/RoomInfo";
import { RoomParticipants } from "../components/rooms/RoomParticipants";
import { getRoom } from "../lib/backend";
import Layout from "../components/Layout";

export const PageChatRoom = () => {
  const { roomId } = useParams();
  const { userData } = loadUserDetails();

  const [roomInfo, setRoomInfo] = useState({});

  const [username, setUsername] = useState(userData?.username || "");
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );

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
      const { res } = await getRoom(roomId);
      if (res) {
        setRoomInfo(res);
      }
    };
    getRoomInfo();

    const handleBeforeUnload = () => {
      socket.emit("eventRoomLeave", roomId, userData);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const onEventNewRoomInfo = (data) => {
      console.log("received eventNewRoomInfo: ", data);
      setRoomInfo(data);
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
    roomInfo,
    userData,
  });

  const handleUpdateRoomName = async (val) => {
    const { res } = await updateRoomInfo(roomId, { roomName: val });
    if (res) {
      setRoomInfo(res);
    }
  };

  return (
    <Layout>
      <RoomInfo
        isOwner={roomInfo.ownerId === userData?._id}
        visibility={roomInfo.visibility || ""}
        roomName={roomInfo.roomName || ""}
        password={password | ""}
        handleUpdateRoomName={handleUpdateRoomName}
        handleUpdatePassword={setPassword}
      />

      <RoomParticipants
        participants={roomInfo.participants}
        onlineUsers={roomInfo.onlineUsers}
      />

      <ContainerMessages password={password} username={username} />
    </Layout>
  );
};
