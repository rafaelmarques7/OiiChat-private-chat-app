import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/navigation";

export const SignOutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("ChatAppUserData");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, []);

  return (
    <>
      <Navigation />
      <div>Sign out successful. You will now be redirected.</div>
    </>
  );
};
