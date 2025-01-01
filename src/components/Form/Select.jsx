import React from "react";

const Select = ({ param, className }) => {
  //   const value = param.values[0];
  return (
    <div>
      <label className="mt-s3 block">Select an option</label>
      <select className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
        {param.values.map((value) => (
          <option
            key={value}
            value={value}
            className="appearance-none bg-zinc-200"
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
