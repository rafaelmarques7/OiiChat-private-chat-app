import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { FormInput } from "../components/FormInput";
import { FormInputWithButton } from "../components/FormInputWithButton";
import SimpleCrypto from "simple-crypto-js";
import { decryptEvent, decryptEvents, updateRoomInfo } from "../lib/utils";
import MessageList from "../components/messages/MessageList";
import { Navigation } from "../components/navigation";
import { URL_MESSAGES_ROOM } from "../config";
import { useParams } from "react-router-dom";
import { FormControl, FormLabel, Select, Switch } from "@chakra-ui/react";

export const PageChatRoom = () => {
  let { roomId } = useParams();

  const [roomName, setRoomName] = useState(`Room ${roomId}`);
  const [visibility, setVisibility] = useState("private");

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );
  const [events, setEvents] = useState([]);
  const [simpleCrypto, setSimpleCrypto] = useState(new SimpleCrypto(password));

  const [usersInRoom, setUsersInRoom] = useState([]);
  const [usersTyping, setUsersTyping] = useState([]);

  // run once on page load
  useEffect(() => {
    console.log("running page load effect");

    // 1 - get username and password from local storage
    const savedUser = localStorage.getItem("username");
    const savedPass = localStorage.getItem("password");
    console.log("getting user preferences from local storage", {
      savedUser,
      savedPass,
    });

    if (savedUser) setUsername(savedUser);
    if (savedPass) setPassword(savedPass);

    // 2 - fetch events from server and decrypt data
    const fetchData = async () => {
      const url = `${URL_MESSAGES_ROOM}/${roomId}`;
      const response = await fetch(url, {
        mode: "cors",
      });
      const data = await response.json();
      if (data && data.length) {
        setEvents(decryptEvents(simpleCrypto, data));
      }
    };

    fetchData();

    const onEventStartTyping = (username) => {
      const newUsersTypings = [...usersTyping, username];
      setUsersTyping(newUsersTypings);
    };

    const onEventStopTyping = (username) => {
      const newUsersTypings = usersTyping.filter((u) => u !== username);
      setUsersTyping(newUsersTypings);
    };

    socket.on("eventStartTyping", onEventStartTyping);
    socket.on("eventStopTyping", onEventStopTyping);

    return () => {
      socket.off("eventStartTyping", onEventStartTyping);
      socket.off("eventStopTyping", onEventStopTyping);
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

  // run when password changes
  useEffect(() => {
    // password has changed, so we need a new crypto client
    const newSimpleCrypto = new SimpleCrypto(password);
    setSimpleCrypto(newSimpleCrypto);

    setEvents(decryptEvents(newSimpleCrypto, events));

    function onChatMessageEvent(event) {
      console.log("got chat message event", {
        event,
        decryptEvent: decryptEvent(newSimpleCrypto, event),
      });
      setEvents((previous) => [
        ...previous,
        decryptEvent(newSimpleCrypto, event),
      ]);
    }

    const onEventStartTyping = (username) => {
      const newUsersTypings = [...usersTyping, username];
      setUsersTyping(newUsersTypings);
    };

    const onEventStopTyping = (username) => {
      const newUsersTypings = usersTyping.filter((u) => u !== username);
      setUsersTyping(newUsersTypings);
    };

    socket.emit("joinRoom", roomId);

    socket.on("eventChatMessage", onChatMessageEvent);
    socket.on("eventStartTyping", onEventStartTyping);
    socket.on("eventStopTyping", onEventStopTyping);

    return () => {
      socket.off("eventChatMessage", onChatMessageEvent);
      socket.off("eventStartTyping", onEventStartTyping);
      socket.off("eventStopTyping", onEventStopTyping);
    };
  }, [password]);

  const onMessageSubmit = (value) => {
    const encryptedValue = simpleCrypto.encrypt(value);

    const payload = {
      username,
      text: encryptedValue,
      timestamp: Date.now(),
    };

    console.log("onMessageSubmit: ", { value, payload, password });

    socket.timeout(10).emit("eventChatMessage", payload, roomId);
  };

  const onStartTyping = () => {
    console.log("inside onStartTyping");
    socket
      .timeout(10)
      .emit("eventStartTyping", { idRoom: roomId, username: username });
  };

  const onStopTyping = () => {
    socket
      .timeout(10)
      .emit("eventStopTyping", { idRoom: roomId, username: username });
  };

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

  const handleUpdateVisibility = async (val) => {
    console.log("update visibility, ", val.target.value);
    setVisibility(val.target.value);

    const res = await updateRoomInfo(roomId, { visibility: val.target.value });
    if (!res) {
      // @todo: handle error
      console.log("error updating room info");
    }
  };

  return (
    <div>
      <Navigation />

      <div className="form-input-container">
        <img src={"/img/visibility.svg"} alt="" className="form-input-icon" />

        <Select
          onChange={handleUpdateVisibility}
          value={visibility}
          size={"md"}
          border={"none"}
          fontSize={14}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </Select>
      </div>

      <FormInput
        initialValue={roomName}
        icon={"/img/group.svg"}
        callback={(val) => handleUpdateRoomName(val)}
      />

      <FormInput
        initialValue={username}
        icon={"/img/username.svg"}
        placeholder="Username"
        callback={(val) => setUsername(val)}
      />

      <FormInput
        initialValue={password}
        icon={"/img/lock.svg"}
        placeholder="Password"
        callback={(val) => setPassword(val)}
      />

      <div className="message-list-container">
        <MessageList userId={username} messages={events} />
        {usersTyping.length > 0 && (
          <p>{usersTyping.join(", ")} is typing... </p>
        )}
      </div>

      <div className="submit-message-container">
        <FormInputWithButton
          resetOnSubmit={true}
          placeholder={"Type a message..."}
          callbackSubmit={onMessageSubmit}
          callbackStartTyping={onStartTyping}
          callbackStopTyping={onStopTyping}
        />
      </div>
    </div>
  );
};
