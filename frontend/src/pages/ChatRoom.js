import React, { useState, useEffect, useRef } from "react";
import { socket } from "../lib/socket";
import { FormInput } from "../components/FormInput";
import SimpleCrypto from "simple-crypto-js";
import { loadUserDetails, updateRoomInfo } from "../lib/utils";
import { Navigation } from "../components/navigation";
import { useParams } from "react-router-dom";
import { ContainerMessages } from "../components/messages/ContainerMessages";

export const PageChatRoom = () => {
  let { roomId } = useParams();
  const { isLoggedIn, userData } = loadUserDetails();

  const [roomName, setRoomName] = useState("");
  const [visibility, setVisibility] = useState("");

  const [username, setUsername] = useState(userData?.username || "");
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );
  const [events, setEvents] = useState([]);
  const [simpleCrypto, setSimpleCrypto] = useState(new SimpleCrypto(password));

  const [usersInRoom, setUsersInRoom] = useState([]);

  // run once on page load
  useEffect(() => {
    console.log("running page load effect.");

    // 1 - get username and password from local storage
    const { isLoggedIn, userData } = loadUserDetails();
    const savedUser = userData?.username;
    // const savedUser = localStorage.getItem("username");
    const savedPass = localStorage.getItem("password");
    console.log("getting user preferences from local storage", {
      savedUser,
      savedPass,
    });

    if (savedUser) setUsername(savedUser);
    if (savedPass) setPassword(savedPass);

    const handleBeforeUnload = () => {
      socket.emit("eventRoomLeave", roomId, userData);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
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

  console.log("rendering chat page with events: ", {
    username,
    password,
    events,
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

      <div className="chatroom-room-settings-container">
        <FormInput
          initialValue={roomName}
          icon={"/img/group.svg"}
          callback={(val) => handleUpdateRoomName(val)}
          tooltipText="Change room name"
        />
        <FormInput
          initialValue={password}
          icon={"/img/lock.svg"}
          placeholder="Password"
          callback={(val) => setPassword(val)}
          tooltipText="Password used to encrypt messages"
        />
      </div>

      <ContainerMessages password={password} username={username} />
    </div>
  );
};
