import { socket } from "../../lib/socket";
import React, { useState, useEffect, useRef } from "react";
import { FormInputWithButton } from "../FormInputWithButton";
import SimpleCrypto from "simple-crypto-js";
import { decryptEvent, decryptEvents } from "../../lib/utils";
import MessageList from "..//messages/MessageList";
import { useParams } from "react-router-dom";
import { IsTyping } from "./IsTyping";
import {
  getMessagesByRoom,
  safeGetReq,
  safeGetWithPagination,
} from "../../lib/backend";
import { QUERY_SIZE, URL_MESSAGES_ROOM } from "../../config";
import "./index.css";

export const ContainerMessages = ({ password, username }) => {
  const { roomId } = useParams();
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [events, setEvents] = useState([]);
  const [simpleCrypto, setSimpleCrypto] = useState(new SimpleCrypto(password));
  const [usersTyping, setUsersTyping] = useState([]);

  const [messagesEndRef, messagesTopRef] = [useRef(null), useRef(null)];
  const refPrevEvents = useRef();
  const containerRef = useRef();

  // handle scrolling to the correct place when new messages are added
  useEffect(() => {
    const last_msg = events?.[events?.length - 1];
    const prev_last_msg =
      refPrevEvents?.current?.[refPrevEvents?.current?.length - 1];

    const shouldScrollDown = last_msg?.timestamp > prev_last_msg?.timestamp;
    console.log("received events, should scroll down: ", shouldScrollDown);

    if (shouldScrollDown) {
      messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    messagesTopRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  // run once on page load
  useEffect(() => {
    console.log("running page load effect.");

    // fetch events from server and decrypt data
    const fetchData = async () => {
      const { res } = await getMessagesByRoom(roomId);
      if (res) {
        setEvents(decryptEvents(simpleCrypto, res));
        res?.length < QUERY_SIZE && setCanLoadMore(false);
        refPrevEvents.current = events;
      }
    };
    fetchData();

    // the functions below are used to listen to typing events from the server
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

  // run when password changes
  useEffect(() => {
    console.log("running password change effect.");

    // update the encryption client
    const newSimpleCrypto = new SimpleCrypto(password);
    setSimpleCrypto(newSimpleCrypto);

    // decrypt events using new client
    setEvents(decryptEvents(newSimpleCrypto, events));

    // update the socket event handler to use the latest crypto client
    function onChatMessageEvent(event) {
      console.log("received message", {
        event,
        decryptEvent: decryptEvent(newSimpleCrypto, event),
      });
      setEvents((previous) => [
        ...previous,
        decryptEvent(newSimpleCrypto, event),
      ]);
    }
    socket.on("eventChatMessage", onChatMessageEvent);

    return () => {
      socket.off("eventChatMessage", onChatMessageEvent);
    };
  }, [password]);

  const onMessageSubmit = (value) => {
    const payload = {
      username,
      text: simpleCrypto.encrypt(value),
      timestamp: Date.now(),
    };

    console.log("sending message: ", {
      payload,
      roomId,
      password,
      simpleCrypto,
    });
    socket.emit("eventChatMessage", payload, roomId);
  };

  // the functions below are used to let the server know about this users typing state
  const onStartTyping = () => {
    console.log("sending eventStartTyping");
    socket.emit("eventStartTyping", { idRoom: roomId, username: username });
  };

  const onStopTyping = () => {
    console.log("sending eventStopTyping");
    socket.emit("eventStopTyping", { idRoom: roomId, username: username });
  };

  const handleLoadMoreMessages = async () => {
    if (!canLoadMore) return;

    const newPage = page + 1;
    const { res, hasMoreToLoad } = await safeGetWithPagination(
      `${URL_MESSAGES_ROOM}/${roomId}`,
      newPage,
      QUERY_SIZE
    );
    if (res) {
      const newEvents = decryptEvents(simpleCrypto, res);
      const updatedEvents = [...newEvents, ...events];

      setEvents(updatedEvents);
      setPage(newPage);
      setCanLoadMore(hasMoreToLoad);

      refPrevEvents.current = events;
    }
  };

  console.log("rendering chat: ", {
    events,
    usersTyping,
    password,
    simpleCrypto,
  });

  return (
    <>
      <div className="load-messages-button" onClick={handleLoadMoreMessages}>
        {canLoadMore ? "Load older messages" : "No older messages to load"}
      </div>

      <div ref={containerRef} className="message-list-container">
        <MessageList userId={username} messages={events} />
        <div ref={messagesEndRef} style={{ height: 0 }} />
      </div>

      <div className="submit-message-container">
        <IsTyping usersTyping={usersTyping} />
        <FormInputWithButton
          resetOnSubmit={true}
          callbackSubmit={onMessageSubmit}
          callbackStartTyping={onStartTyping}
          callbackStopTyping={onStopTyping}
          disabled={!username}
        />
      </div>
    </>
  );
};
