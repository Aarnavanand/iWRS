"use client";
import React, { useState, useEffect } from "react";
import InputField from "@/components/Form/InputField";
import RadioFour from "@/components/Checkboxes/RadioFour";
import { useForm } from "react-hook-form";

const Page = (data) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
=======



const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();


  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const dob = watch("Subject DoB");
  const age = calculateAge(dob);
  
  const calculateBMI = (height, weight) => {
    if (height > 0 && weight > 0) {
      return (weight / ((height / 100) ** 2)).toFixed(2);
    }
    return "";
  };

  const height = watch("Subject Height (in cm)");
  const weight = watch("Subject Weight (in kg)");
  const bmi = calculateBMI(height, weight);
  useEffect(() => {
    setValue("Age", age);
    setValue("BMI (kg/m^2)", bmi);
  }, [age, bmi]);
 

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col gap-5.5 p-6.5">
        <div className="place-self-center w-full md:w-3/4 max-w-203">
          <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <span className="text-lg text-gray-400 font-medium">
              Demographic Information
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2 ">
              <InputField
                label="Subject Number"
                name="Subject Number"
                type="number"
                placeholder=""
                defaultValue={data?.username}
                register={register}
                error={errors?.username}
              />
              <InputField
                label="Subject Initial"
                name="Subject Initial"
                type="text"
                placeholder=""
                defaultValue={data?.username}
                register={register}
                error={errors?.username}
              />
              <div className="">
                <h3 className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Subject Gender
                </h3>
                <RadioFour
                  options={["Male", "Female"]}
                  register={register}
                  catagory={"sex"}
                />
              </div>
              <InputField
                label="Subject DOB"
                name="Subject DoB"
                type="date"
                placeholder=""
                defaultValue={data?.username}
                register={register}
                error={errors?.username}
              />
              <InputField
                label="Subject Current Age"
                name="Subject Current Age"
                type="number"
                placeholder=""
                isDisabled={true}
                defaultValue={age}
                register={register}
                error={errors?.username}
              />
              <InputField
                label="Subject Height (in cm)"
                name="Subject Height (in cm)"
                type="number"
                placeholder=""
                defaultValue={data?.username}
                register={register}
                error={errors?.username}
              />
              <InputField
                label="Subject Weight (in kg)"
                name="Subject Weight (in kg)"
                type="number"
                placeholder=""
                defaultValue={data?.username}
                register={register}
                error={errors?.username}
              />
              <InputField
                label="Subject BMI (kg/m^2)"
                name="Subject BMI (kg/m^2)"
                type="number"
                isDisabled={true}
                placeholder=""
                defaultValue={bmi}
                register={register}
                error={errors?.username}
              />
              <input
                type="hidden"
                name="Age"
                value={age}
                {...register("Age")}
              />
              <input
                type="hidden"
                name="BMI (kg/m^2)"
                value={bmi}
                {...register("BMI (kg/m^2)")}
              />

              <div>
                <h3 className="mb-3 block text-sm font-medium text-black dark:text-white">
                  I/E Criteria met by subject
                </h3>
                <RadioFour
                  options={["Yes", "No"]}
                  register={register}
                  catagory={"ie_criteria"}
                />
              </div>


              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  {...register("remarks")}
                  rows={6}
                  placeholder="Default textarea"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>



              
              
              <button
                className="bg-blue-400 text-white p-2 rounded-md"
                onClick={onSubmit}
              >
                submit
              </button>

              <button
                type="button"
                className="bg-red-400 text-white p-2 rounded-md"
                onClick={() => reset()}
              >
                Cancel
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
