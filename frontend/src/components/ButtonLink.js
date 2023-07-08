import { useNavigate } from "react-router-dom";

export const ButtonLink = ({ label, targetUrl }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate(targetUrl)}
        className="btn btn-custom btn-lg page-scroll"
      >
        {label}
      </button>
    </>
  );
};
