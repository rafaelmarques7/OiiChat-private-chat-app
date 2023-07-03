import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { Events } from "../components/Events";
import { FormInput } from "../components/FormInput";
import { FormInputWithButton } from "../components/FormInputWithButton";
import SimpleCrypto from "simple-crypto-js";
import { decryptSafe } from "../lib/utils";
import MessageList from "../components/messages/MessageList";

export const PageNewChat = () => {
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState([]);
  const [simpleCrypto, setSimpleCrypto] = useState(new SimpleCrypto(password));

  useEffect(() => {
    console.log("useEffect: password: ", password);
    const newSimpleCrypto = new SimpleCrypto(password);
    setSimpleCrypto(newSimpleCrypto);

    // update the events using the new encryption key
    const decryptedEvents = events.map((event) => {
      return decryptSafe(newSimpleCrypto, event);
    });
    setEvents(decryptedEvents);
  }, [password]);

  useEffect(() => {
    function onChatMessageEvent(value) {
      console.log("onChatMessageEvent: ", value);

      // decrypt the message
      const decryptedValue = decryptSafe(simpleCrypto, value);
      setEvents((previous) => [...previous, decryptedValue]);
    }

    socket.on("eventChatMessage", onChatMessageEvent);

    return () => {
      socket.off("eventChatMessage", onChatMessageEvent);
    };
  }, []);

  const onMessageSubmit = (value) => {
    const encryptedValue = simpleCrypto.encrypt(value);
    console.log("onMessageSubmit: ", value, encryptedValue);

    socket.timeout(10).emit("eventChatMessage", encryptedValue);
  };

  return (
    <div className="App">
      <FormInput callback={(val) => setPassword(val)} />
      <p>password: {password}</p>
      <Events events={events} />
      <FormInputWithButton callback={onMessageSubmit} resetOnSubmit={true} />
      <MessageList
        userId="Rafa"
        messages={[
          { text: "Ola", author: { username: "Rafa", id: "Rafa" } },
          { text: "Entao!", author: { username: "Miguel", id: "Miguel" } },
        ]}
      />
    </div>
  );
};
