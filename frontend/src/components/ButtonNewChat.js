import { useNavigate } from "react-router-dom";

export const ButtonNewChat = ({ label = "Create chat room" }) => {
  const navigate = useNavigate();

  const onClick = async () => {
    navigate("/rooms/new-room");
  };

  return (
    <>
      <button onClick={onClick} className="btn btn-custom btn-lg page-scroll">
        {label}
      </button>
    </>
  );
};
