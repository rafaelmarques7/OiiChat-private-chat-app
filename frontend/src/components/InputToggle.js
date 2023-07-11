import React, { useState } from "react";
import "./InputToggle.css";

export const InputToggle = ({ isChecked, onChange }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider round"></span>
    </label>
  );
};
