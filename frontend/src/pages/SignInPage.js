import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/navigation";
import { sha256Hash } from "../lib/utils";
import { URL_USER_SIGN_IN } from "../config";

export const SignInPage = () => {
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
    };

    fetch(URL_USER_SIGN_IN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("User details not found");
        }
        if (!response.ok) {
          throw new Error("Sign-In failed");
        }
        return response.json();
      })
      .then((data) => {
        // Save metadata for the rest of the app to use
        localStorage.setItem("ChatAppUserData", JSON.stringify({ username }));

        // this will trigger a redirect after 2 seconds
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        setError(error.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  };

  return (
    <>
      <Navigation />
      <div className="signup-container">
        <h1>Sign In</h1>
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
          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
        {success && <p>Login successful! You will now be redirected ...</p>}
      </div>
    </>
  );
};
