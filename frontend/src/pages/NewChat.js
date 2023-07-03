import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { FormInput } from "../components/FormInput";
import { FormInputWithButton } from "../components/FormInputWithButton";
import SimpleCrypto from "simple-crypto-js";
import { decryptSafe } from "../lib/utils";
import MessageList from "../components/messages/MessageList";

export const PageNewChat = () => {
  const [username, setUsername] = useState("John Doe");
  const [password, setPassword] = useState("default-encryption-key");
  const [events, setEvents] = useState([]);
  const [simpleCrypto, setSimpleCrypto] = useState(new SimpleCrypto(password));

  useEffect(() => {
    const newSimpleCrypto = new SimpleCrypto(password);
    setSimpleCrypto(newSimpleCrypto);

    // update the events using the new encryption key
    const decryptedEvents = events.map((event) => {
      const newEvent = {
        username: event.username,
        text: decryptSafe(newSimpleCrypto, event.text),
        timestamp: event.timestamp,
      };
      return newEvent;
    });
    setEvents(decryptedEvents);

    function onChatMessageEvent(event) {
      const newEvent = {
        username: event.username,
        text: decryptSafe(newSimpleCrypto, event.text),
        timestamp: event.timestamp,
      };

      setEvents((previous) => [...previous, newEvent]);
    }

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

    socket.timeout(10).emit("eventChatMessage", payload);
  };

  console.log("rendering chat page with events: ", {
    username,
    password,
    events,
  });

  return (
    <div className="App">
      <div>
        <FormInput
          placeholder="Username"
          callback={(val) => setUsername(val)}
        />
      </div>
      <FormInput placeholder="Password" callback={(val) => setPassword(val)} />
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
