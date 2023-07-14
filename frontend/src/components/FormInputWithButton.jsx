import React, { useState, useEffect, useRef } from "react";
import autosize from "autosize";
import { Textarea, Flex, Button } from "@chakra-ui/react";

export const FormInputWithButton = ({
  callbackSubmit = () => {},
  callbackStartTyping = () => {},
  callbackStopTyping = () => {},
  resetOnSubmit = false,
  placeholder = "\nType a message ...",
}) => {
  const [value, setValue] = useState("");
  const [shouldResize, setShouldResize] = useState(false);

  const ref = useRef();

  useEffect(() => {
    autosize(ref.current);
    setShouldResize(false);

    return () => {
      autosize.destroy(ref.current);
    };
  }, [shouldResize]);

  function onSubmit(event) {
    event.preventDefault();
    callbackSubmit(value);
    callbackStopTyping();

    if (resetOnSubmit) {
      setValue("");
      setShouldResize(true);
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

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSubmit(event);
    }
  }
  return (
    // <Flex className="submit-message-container">
    <>
      <form onSubmit={onSubmit} className="submit-message-form">
        <Textarea
          ref={ref}
          style={{ fontSize: "1.5rem", border: "none" }}
          placeholder={placeholder}
          onChange={(e) => handleSetValue(e.target.value)}
          value={value}
          onKeyDown={handleKeyDown}
        />

        <div className="submit-message-button-container">
          <Button
            disabled={!value}
            type="submit"
            colorScheme="white"
            className="submit-message-button"
            size={"lg"}
          >
            <img
              src={"/img/send.svg"}
              alt=""
              className="form-input-icon"
              style={{ width: "35px", height: "35px" }}
            />
          </Button>
        </div>
      </form>
      {/* </Flex> */}
    </>
  );
};
