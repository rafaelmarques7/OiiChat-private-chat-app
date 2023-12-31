import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sha256Hash } from "../lib/utils";
import { URL_USER_SALT, URL_USER_SIGN_IN } from "../config";
import Layout from "../components/Layout";
import { checkLoginDetails, getUserSalt } from "../lib/backend";

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

    console.log("getting user salt");
    const opGet = await getUserSalt(username);
    console.log({ opGet });
    if (opGet?.err) {
      setError(opGet.err);
      setTimeout(() => {
        setError("");
      }, 5000);

      return;
    }
    const salt = opGet?.res;

    console.log("checking login details");
    const opLogin = await checkLoginDetails(username, password, salt);
    if (opLogin?.err) {
      setError(opLogin.err);
      setTimeout(() => {
        setError("");
      }, 5000);

      return;
    }

    const data = opLogin.res;
    // Save metadata for the rest of the app to use
    console.log("adding user data to local storage", data);
    localStorage.setItem("ChatAppUserData", JSON.stringify(data));

    // this will trigger a redirect after 2 seconds
    setSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <Layout>
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
    </Layout>
  );
};
