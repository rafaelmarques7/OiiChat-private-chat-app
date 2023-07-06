import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewRoom } from "../lib/utils";

export const ButtonNewChat = ({ label = "Create chat room" }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onClick = async () => {
    const idRoom = await createNewRoom();

    if (idRoom) {
      navigate(`/rooms/${idRoom}`);
    }

    setError("Error creating room. Please try again later.");
    setTimeout(() => setError(null), 5000);
  };

  return (
    <>
      <button onClick={onClick} className="btn btn-custom btn-lg page-scroll">
        {label}
      </button>
      {error && <p className="text-danger">{error}</p>}
    </>
  );
};
