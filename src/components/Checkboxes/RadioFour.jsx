import { useState } from "react";

const RadioFour = ({ options, register, catagory }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div>
      {options.map((option, index) => (
        <label
          key={index}
          htmlFor={`radio-${option}`}
          className="flex cursor-pointer select-none items-center"
        >
          <div className="relative">
            <input
              type="radio"
              value={option}
              id={`radio-${option}`}
              name={`${catagory}Radio`}
              {...register(`${catagory}Radio`)}
              className="sr-only"
              checked={selectedOption === option}
              onChange={() => {
                setSelectedOption(option);
              }}
            />
            <div
              className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
                selectedOption === option && "border-primary"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                  selectedOption === option && "!bg-primary"
                }`}
              >
                {" "}
              </span>
            </div>
          </div>
          {option}
        </label>
      ))}
    </div>
  );
};

export default RadioFour;
