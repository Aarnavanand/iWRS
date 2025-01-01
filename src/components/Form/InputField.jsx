import { FieldError } from "react-hook-form";


const InputField = ({
  label,
  type = "text",
  register,
  name,
  placeholder,
  defaultValue,
  error,
  inputProps,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  defaultValue={defaultValue}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  {...inputProps}
                />{error?.message && (
                    <p className="text-xs text-red-400">{error.message.toString()}</p>
                   )}
              </div>

    </div>
  );
};

export default InputField;
