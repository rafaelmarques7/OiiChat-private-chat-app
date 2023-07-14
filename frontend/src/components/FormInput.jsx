import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

export const FormInput = ({
  initialValue,
  callback = () => null,
  icon,
  placeholder = "Enter value",
  tooltipText = "tooltip",
  disabled = false,
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
        value={value || initialValue}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export const ReadOnlyInput = ({
  value,
  callback,
  icon,
  placeholder = "Enter value",
  tooltipText = "tooltip",
  disabled = false,
}) => {
  const tooltipId = `tooltip-${value}`;

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
        value={value}
        placeholder={placeholder}
        disabled={true}
      />
    </div>
  );
};
