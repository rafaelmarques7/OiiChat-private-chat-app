import { useNavigate } from "react-router-dom";

export const ButtonPublicRooms = ({ label = "See public rooms" }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate("/rooms/public-rooms")}
        className="btn btn-custom btn-lg page-scroll"
      >
        {label}
      </button>
    </>
  );
};
