import { useEffect, useState } from "react";
import { isCorrectUserPassword } from "../lib/utils";
import "./PasswordValidationForm.css";

export const PasswordValidationForm = ({ userData, callback }) => {
  const [password, setPassword] = useState("");

  useEffect(() => {
    const update = async () => {
      const isCorrect = await isCorrectUserPassword(
        userData,
        password,
        userData?.salt
      );
      callback({ isCorrect, password });
    };
    update();
  }, [password]);

  return (
    <input
      type="password"
      id="password"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  );
};
