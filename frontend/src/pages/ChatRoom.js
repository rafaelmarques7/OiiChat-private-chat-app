import React, { useState, useEffect, useRef } from "react";
import { socket } from "../lib/socket";
import {
  isCorrectPassword,
  isCorrectRoomPassword,
  loadRoomPassword,
  loadUserData,
  updateRoomInfo,
} from "../lib/utils";
import { useParams } from "react-router-dom";
import { ContainerMessages } from "../components/messages/ContainerMessages";
import { RoomInfo } from "../components/rooms/RoomInfo";
import { RoomParticipants } from "../components/rooms/RoomParticipants";
import { addPasswordToVault, getRoom } from "../lib/backend";
import Layout from "../components/Layout";
import { RoomPasswordDecrypt } from "../components/rooms/RoomPasswordDecrypt";
import { saveRoomPasswordToLS } from "../lib/localstorage";
import { AddToVault } from "../components/vault/addToVault";

export const PageChatRoom = () => {
  const { roomId } = useParams();

  const [roomInfo, setRoomInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [passwordRoom, setPasswordRoom] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);

  const [passwordIsCorrect, setPasswordIsCorrect] = useState(false);
  const [shouldAddToVault, setShouldAddToVault] = useState(true);
  const [passwordUser, setPasswordUser] = useState("");
  const [error, setError] = useState(null);

  // run once on page load
  useEffect(() => {
    socket.emit("joinRoom", roomId, userData);

    // 2 - get room info, user data, and check room password
    const getInfo = async () => {
      const promiseGetRoom = getRoom(roomId);
      const promiseUserData = loadUserData();

      const [opGetRoom, opGetUserData] = await Promise.all([
        promiseGetRoom,
        promiseUserData,
      ]);

      if (opGetRoom.err || opGetUserData.err) {
        console.log("error getting room info OR user data: ", {
          err_1: opGetRoom.err,
          err_2: opGetUserData.err,
        });
      }

      opGetUserData.res && setUserData(opGetUserData.res);
      opGetRoom.res && setRoomInfo(opGetRoom.res);

      const { password, isEncrypted } = loadRoomPassword(
        roomId,
        opGetUserData.res
      );

      if (!password || !isCorrectRoomPassword(password, opGetRoom.res)) {
        setPasswordRoom("");
        return;
      }

      setPasswordRoom(password);
      setPasswordIsCorrect(true);
      setShouldAddToVault(false);
      setIsEncrypted(isEncrypted);
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
    password: passwordRoom,
  });

  const handleUpdateRoomName = async (val) => {
    const { res } = await updateRoomInfo(roomId, { roomName: val });
    if (res) {
      setRoomInfo(res);
    }
  };

  const handleUpdateRoomPassword = async (updatedRoomPass) => {
    const isCorrect = isCorrectRoomPassword(updatedRoomPass, roomInfo);
    if (!isCorrect) {
      console.log("user typed incorrect room password");
      return;
    }

    console.log("user typed correct room password");
    setPasswordRoom(updatedRoomPass);
    setPasswordIsCorrect(true);
    setIsEncrypted(false);
    saveRoomPasswordToLS(roomId, updatedRoomPass);
  };

  const handleRoomPasswordDecryptEvent = async (res) => {
    if (!res?.isCorrect || !res?.password) {
      console.log("incorrect password");
      return;
    }

    console.log("correct password: ", res.password);
    setPasswordRoom(res.password);
    setPasswordIsCorrect(true);
    setIsEncrypted(false);
    saveRoomPasswordToLS(roomId, res.password);
  };

  const handleUserPasswordChange = async (updatedUserPass) => {
    setPasswordUser(updatedUserPass);

    const isCorrect = await isCorrectPassword(userData, updatedUserPass);
    if (!isCorrect) {
      console.log("user entered incorrect password");
      return;
    }

    console.log("user typed correct password, calling backend");
    const op = await addPasswordToVault(roomId, updatedUserPass, passwordRoom);
    const msg = op.err ? "Error adding to vault" : "Added to vault";

    setShouldAddToVault(false);
    setError(msg);
    setTimeout(() => setError(null, 5000));
  };

  const shouldRenderAddToVault =
    userData?._id !== roomInfo?.ownerId &&
    passwordIsCorrect &&
    shouldAddToVault;

  return (
    <Layout>
      <RoomInfo
        isOwner={roomInfo?.ownerId === userData?._id}
        visibility={roomInfo?.visibility || ""}
        roomName={roomInfo?.roomName || ""}
        password={passwordRoom || ""}
        isCorrectPassword={passwordIsCorrect}
        handleUpdateRoomName={handleUpdateRoomName}
        handleUpdatePassword={handleUpdateRoomPassword}
      />

      <AddToVault
        shouldRender={shouldRenderAddToVault}
        addToVault={shouldAddToVault}
        setAddToVault={setShouldAddToVault}
        password={passwordUser}
        setPassword={handleUserPasswordChange}
      />

      {error && <div className="error">{error}</div>}

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
        password={passwordRoom}
        username={userData?.username || ""}
      />
    </Layout>
  );
};
