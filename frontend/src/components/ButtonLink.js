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

export const ButtonAction = ({ label, callback }) => {
  return (
    <>
      <button
        onClick={() => callback()}
        className="btn btn-custom btn-lg page-scroll"
      >
        {label}
      </button>
    </>
  );
};
