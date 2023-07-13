import { useEffect, useState } from "react";
import { isCorrectPassword } from "../lib/utils";
import "./PasswordValidationForm.css";

export const PasswordValidationForm = ({ userData, callback }) => {
  const [password, setPassword] = useState("");

  useEffect(() => {
    const update = async () => {
      const isCorrect = await isCorrectPassword(userData, password);
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
