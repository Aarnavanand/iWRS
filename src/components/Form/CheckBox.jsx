"use client";
import React, { useState, useId } from "react";

const CheckBox = ({ param, className = "" }) => {
  const [value, setValue] = useState("");
  const inputId = useId();

  const change = (e) => {
    setValue(e.target.value);
    console.log(value);
  };

  return (
    <div className="mt-3">
      <label className="flex cursor-pointer items-center">
        <input
          id={inputId}
          onChange={change}
          type="checkbox"
          className={`size-5 rounded border-2 border-gray-600 checked:bg-thmaccent focus:ring-0 focus:ring-offset-0 ${className}`}
        />
        <span className="ml-2">{param.label}</span>
      </label>
    </div>
  );
};

export default CheckBox;
