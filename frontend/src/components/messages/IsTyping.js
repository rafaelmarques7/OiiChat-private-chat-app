export const IsTyping = ({ usersTyping }) => {
  if (!usersTyping || usersTyping.length === 0) return null;

  let message = "";

  if (usersTyping.length === 1) {
    const username = usersTyping[0] || "User";
    message = `${username} is typing...`;
  }

  if (usersTyping.length > 1) {
    message = "Multiple users are typing...";
  }

  return <p style={{ fontWeight: "bold" }}>{message}</p>;
};
