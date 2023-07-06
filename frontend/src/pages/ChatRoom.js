import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { FormInput } from "../components/FormInput";
import { FormInputWithButton } from "../components/FormInputWithButton";
import SimpleCrypto from "simple-crypto-js";
import { decryptEvent, decryptEvents } from "../lib/utils";
import MessageList from "../components/messages/MessageList";
import { Navigation } from "../components/navigation";
import { URL_MESSAGES } from "../config";
import { useParams } from "react-router-dom";

export const PageChatRoom = () => {
  let { roomId } = useParams();

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );
  const [events, setEvents] = useState([]);
  const [simpleCrypto, setSimpleCrypto] = useState(new SimpleCrypto(password));

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
    // const fetchData = async () => {
    //   const response = await fetch(URL_MESSAGES, {
    //     mode: "cors",
    //   });
    //   const data = await response.json();
    //   setEvents(decryptEvents(simpleCrypto, data));
    // };

    // fetchData();
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

    socket.emit("join", roomId);

    socket.on("eventChatMessage", onChatMessageEvent);

    return () => {
      socket.off("eventChatMessage", onChatMessageEvent);
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

  console.log("rendering chat page with events: ", {
    username,
    password,
    events,
  });

  return (
    <div>
      <Navigation />

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

      <MessageList userId={username} messages={events} />

      <div className="submit-message-container">
        <FormInputWithButton
          placeholder={"Type a message..."}
          callback={onMessageSubmit}
          resetOnSubmit={true}
        />
      </div>
    </div>
  );
};
