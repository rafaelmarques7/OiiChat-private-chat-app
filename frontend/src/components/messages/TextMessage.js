import Avatar from "./Avatar";

export default ({ direction, text, author }) => (
  <div className={direction === "incoming" ? "container" : ""}>
    <div className="flex-container">
      <div className="flex-items">
        <div className="author-text">
          <div className={direction === "incoming" ? "container" : ""}>
            {author}
          </div>
          <div
            className={
              direction === "incoming"
                ? "message-incoming container"
                : "message-outgoing"
            }
          >
            {text}
          </div>
        </div>
        <div className="avatar">
          <Avatar
            initials={author}
            style={{
              transform: direction === "incoming" && "scaleX(-1)",
            }}
          />
        </div>
      </div>
    </div>
  </div>
);
