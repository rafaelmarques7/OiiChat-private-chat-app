import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

export const FormInput = ({
  initialValue,
  callback,
  icon,
  placeholder = "Enter value",
  tooltipText = "tooltip",
}) => {
  const [value, setValue] = useState(initialValue || "");

  const onChange = (event) => {
    event.preventDefault();
    setValue(event.target.value);
    callback(event.target.value);
  };

  const tooltipId = `tooltip-${initialValue}`;

  return (
    <div className="form-input-container">
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
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};
