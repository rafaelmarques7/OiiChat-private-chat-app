import TextMessage from "./TextMessage";

export default ({ messages, userId }) => (
  <div>
    {messages.map((message) => (
      <TextMessage
        key={message?._id}
        text={message?.text}
        author={message?.username}
        direction={message?.username === userId ? "outgoing" : "incoming"}
      />
    ))}
  </div>
);
