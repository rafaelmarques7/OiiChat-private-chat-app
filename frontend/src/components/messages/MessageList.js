import TextMessage from "./TextMessage";

export default ({ messages, userId }) => (
  <div className="message-list-container">
    {messages.map((message) => (
      <TextMessage
        key={message?.id}
        text={message?.text}
        author={message?.author?.username}
        direction={message?.author?.id === userId ? "outgoing" : "incoming"}
      />
    ))}
  </div>
);
