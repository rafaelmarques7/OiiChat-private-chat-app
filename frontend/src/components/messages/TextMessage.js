import Avatar from "./Avatar";

export default ({ direction, text, author }) => (
  <div className={direction === "incoming" ? "container" : ""}>
    <div className="flex-container">
      <div className="flex-items">
        <div
          className={
            direction === "incoming" ? "flex-items-left" : "flex-items-right"
          }
        >
          {author}
        </div>
        <div className="author-text">
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
      </div>
    </div>
  </div>
);
