import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export const SignOutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("ChatAppUserData");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, []);

  return (
    <Layout>
      <div>Sign out successful. You will now be redirected.</div>
    </Layout>
  );
};
