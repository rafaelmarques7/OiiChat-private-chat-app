import React, { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { MyForm } from "../components/MyForm";
import { Events } from "../components/Events";
import { FormInput } from "../components/FormInput";
import { FormInputWithButton } from "../components/FormInputWithButton";
import SimpleCrypto from "simple-crypto-js";

export const PageNewChat = () => {
  const [password, setPassword] = useState("");
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onChatMessageEvent(value) {
      console.log("onChatMessageEvent: ", value);
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("eventChatMessage", onChatMessageEvent);

    return () => {
      socket.off("eventChatMessage", onChatMessageEvent);
    };
  }, []);

  const onMessageSubmit = (value) => {
    console.log("onMessageSubmit: ", value);

    const simpleCrypto = new SimpleCrypto(password);
    const encryptedValue = simpleCrypto.encrypt(value);

    socket.timeout(10).emit("eventChatMessage", encryptedValue);
  };

  return (
    <div className="App">
      <FormInput callback={(val) => setPassword(val)} />
      <p>password: {password}</p>
      <Events events={fooEvents} />
      <FormInputWithButton callback={onMessageSubmit} resetOnSubmit={true} />
    </div>
  );
};
