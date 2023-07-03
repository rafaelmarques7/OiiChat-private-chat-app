import React, { useState } from "react";

export const FormInputWithButton = ({
  callback,
  buttonLabel = "Submit",
  resetOnSubmit = false,
}) => {
  const [value, setValue] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    callback(value);

    if (resetOnSubmit) {
      setValue("");
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <input onChange={(e) => setValue(e.target.value)} value={value} />

      <button type="submit" disabled={!value}>
        {buttonLabel}
      </button>
    </form>
  );
};
