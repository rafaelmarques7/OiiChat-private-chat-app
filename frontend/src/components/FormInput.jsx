import React, { useState } from "react";

export const FormInput = ({ callback, placeholder = "Enter value" }) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    event.preventDefault();
    setValue(event.target.value);
    callback(event.target.value);
  };

  return <input onChange={onChange} value={value} placeholder={placeholder} />;
};
