import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import "./FormRoomPassword.css";
import { v4 as uuidv4 } from "uuid";

export const FormRoomPassword = ({
  initialValue,
  callback = () => null,
  icon,
  placeholder = "Rooms password",
  tooltipText = "tooltip",
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue || "");
  const tooltipId = `tooltip-${initialValue}`;

  const onChange = (event) => {
    event.preventDefault();
    setValue(event.target.value);
    callback(event.target.value);
  };

  const handleSuggestPassword = () => {
    const suggestPwd = uuidv4();
    setValue(suggestPwd);
    callback(suggestPwd);
  };

  return (
    <div className="form-room-password-container">
      <div className="form-room-password-container-data">
        <img
          src={icon}
          alt=""
          className="form-input-icon"
          data-tooltip-id={tooltipId}
          data-tooltip-content={tooltipText}
          data-tooltip-place="top"
        />
        <Tooltip id={tooltipId} />

        <input
          className="form-input-field"
          onChange={onChange}
          value={value || initialValue}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {!value && (
        <div className="form-room-password-container-suggestion">
          <button
            className="button-create-password"
            onClick={handleSuggestPassword}
          >
            Suggest password
          </button>
        </div>
      )}
    </div>
  );
};
