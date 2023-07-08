import TextMessage from "./TextMessage";
import { howLongAgo } from "./lib";

export default ({ messages, userId }) => {
  if (!messages || messages.length === 0)
    return (
      <TextMessage
        author={"Admin"}
        timestamp={"just now"}
        text="New messages will appear here"
        direction="incoming"
      />
    );

  return (
    <>
      {messages.map((message) => (
        <TextMessage
          key={message?._id}
          text={message?.text}
          author={message?.username}
          timestamp={howLongAgo(message?.timestamp)}
          direction={message?.username === userId ? "outgoing" : "incoming"}
        />
      ))}
    </>
  );
};
