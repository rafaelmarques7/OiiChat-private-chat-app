import TextMessage from "./TextMessage";
import { howLongAgo } from "./lib";

export default ({ messages, userId }) => (
  <div className="message-list-container">
    {messages.map((message) => (
      <TextMessage
        key={message?._id}
        text={message?.text}
        author={message?.username}
        timestamp={howLongAgo(message?.timestamp)}
        direction={message?.username === userId ? "outgoing" : "incoming"}
      />
    ))}
  </div>
);
