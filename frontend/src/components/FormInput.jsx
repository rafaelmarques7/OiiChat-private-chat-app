// FormInput.js
import React, { useState } from "react";

export const FormInput = ({ callback, placeholder = "Enter value", icon }) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    event.preventDefault();
    setValue(event.target.value);
    callback(event.target.value);
  };

  return (
    <div className="form-input-container">
      <img src={icon} alt="" className="form-input-icon" />
      <input
        className="form-input-field"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};
