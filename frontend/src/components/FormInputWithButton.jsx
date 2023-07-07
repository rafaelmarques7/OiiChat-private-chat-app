import React, { useState } from "react";

export const FormInputWithButton = ({
  callbackSubmit = () => {},
  callbackStartTyping = () => {},
  callbackStopTyping = () => {},
  buttonLabel = "Submit",
  resetOnSubmit = false,
  placeholder = "",
}) => {
  const [value, setValue] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    callbackSubmit(value);
    callbackStopTyping();

    if (resetOnSubmit) {
      setValue("");
    }
  }

  function handleSetValue(newValue) {
    if (!value) {
      callbackStartTyping();
    }

    if (newValue === "") {
      callbackStopTyping();
    }

    setValue(newValue);
  }

  return (
    <form onSubmit={onSubmit} className="submit-message-form">
      <input
        placeholder={placeholder}
        onChange={(e) => handleSetValue(e.target.value)}
        value={value}
      />

      <button type="submit" disabled={!value}>
        <img src={"/img/send.svg"} alt="" className="form-input-icon" />
      </button>
    </form>
  );
};
