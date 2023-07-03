import Avatar from "./Avatar";

export default ({ direction, text, author, timestamp }) => (
  <div className={direction === "incoming" ? "message-container" : ""}>
    <div className="flex-container">
      <div className="flex-items">
        <div
          className={
            direction === "incoming" ? "flex-items-left" : "flex-items-right"
          }
        >
          {`${author}, ${timestamp}`}
        </div>
        <div className="author-text">
          <div
            className={
              direction === "incoming"
                ? "message-incoming message-container"
                : "message-outgoing"
            }
          >
            {text}
          </div>
          <div className="avatar">
            <Avatar
              initials={String(author).toUpperCase()}
              style={{
                transform: direction === "incoming" && "scaleX(-1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
