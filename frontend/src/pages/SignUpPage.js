import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sha256Hash } from "../lib/utils";
import { URL_USER_SIGN_UP } from "../config";
import Layout from "../components/Layout";

export const SignUpPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const signUpData = {
      username,
      password: await sha256Hash(password),
      timestamp: Date.now(),
    };

    fetch(URL_USER_SIGN_UP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Sign-up failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("sign up successful. adding metadata to local storage");
        localStorage.setItem("ChatAppUserData", JSON.stringify(data));

        // this will trigger a redirect after 2 seconds
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Layout>
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button disabled={!username || !password} type="submit">
            Sign Up
          </button>
        </form>
        {error && <p>{error}</p>}
        {success && <p>Sign up successful! You will now be redirected ...</p>}
      </div>
    </Layout>
  );
};
