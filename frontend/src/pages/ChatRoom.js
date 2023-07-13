import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import {
  loadRoomPassword,
  loadUserData,
  loadUserDetails,
  updateRoomInfo,
} from "../lib/utils";
import { useParams } from "react-router-dom";
import { ContainerMessages } from "../components/messages/ContainerMessages";
import { RoomInfo } from "../components/rooms/RoomInfo";
import { RoomParticipants } from "../components/rooms/RoomParticipants";
import { getRoom } from "../lib/backend";
import Layout from "../components/Layout";
import { PasswordValidationForm } from "../components/PasswordValidationForm";
import { RoomPasswordDecrypt } from "../components/rooms/RoomPasswordDecrypt";
import { saveRoomPasswordToLS } from "../lib/localstorage";

export const PageChatRoom = () => {
  const { roomId } = useParams();

  const [roomInfo, setRoomInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);

  // run once on page load
  useEffect(() => {
    socket.emit("joinRoom", roomId, userData);

    // 2 - get room info from server
    const getInfo = async () => {
      const promiseGetRoom = getRoom(roomId);
      const promiseUserData = loadUserData();

      const [opGetRoom, opUserData] = await Promise.all([
        promiseGetRoom,
        promiseUserData,
      ]);

      if (opGetRoom.err || opUserData.err) {
        return;
      }

      setUserData(opUserData.res);
      setRoomInfo(opGetRoom.res);

      const { password, isEncrypted } = loadRoomPassword(
        roomId,
        opUserData.res
      );
      console.log("here: ", { password, isEncrypted });

      if (!password) {
        setPassword("");
      } else {
        setPassword(password);
        setIsEncrypted(isEncrypted);
      }
    };
    getInfo();

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

  console.log("rendering chat page: ", {
    roomInfo,
    userData,
    password,
  });

  const handleUpdateRoomName = async (val) => {
    const { res } = await updateRoomInfo(roomId, { roomName: val });
    if (res) {
      setRoomInfo(res);
    }
  };

  const handleRoomPasswordDecryptEvent = async (res) => {
    if (!res?.isCorrect || !res?.password) {
      console.log("incorrect password");
      return;
    }

    setPassword(res.password);
    saveRoomPasswordToLS(roomId, res.password);
  };

  return (
    <Layout>
      <RoomInfo
        isOwner={roomInfo?.ownerId === userData?._id}
        visibility={roomInfo?.visibility || ""}
        roomName={roomInfo?.roomName || ""}
        password={password || ""}
        handleUpdateRoomName={handleUpdateRoomName}
        handleUpdatePassword={setPassword}
      />

      <RoomParticipants
        participants={roomInfo?.participants || []}
        onlineUsers={roomInfo?.onlineUsers || []}
      />

      <RoomPasswordDecrypt
        userData={userData}
        isEncrypted={isEncrypted}
        callback={handleRoomPasswordDecryptEvent}
      />

      <ContainerMessages
        password={password}
        username={userData?.username || ""}
      />
    </Layout>
  );
};
