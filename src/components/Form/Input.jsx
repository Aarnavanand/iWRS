"use client";
import React, { useState, useId } from "react";

const Input = ({ param, className = "" }) => {
  const [value, setValue] = useState("");
  const inputId = useId();

  return (
    <div className="flex-col">
      <label
        htmlFor={inputId}
        className="ml-2 mt-3 block text-lowblack focus:text-thmaccent"
      >
        {param.placeholder}
      </label>
      <input
        id={inputId}
        type={param.type}
        className={`mt-1 w-full rounded-md border-2 border-thmgrey bg-zinc-100 p-2 duration-200 focus:border-thmaccent focus:bg-thmlight active:border-thmaccent active:bg-thmlight ${className}`}
        placeholder={param.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Input;
