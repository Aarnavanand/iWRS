"use client";
import React from "react";
import InputField from "@/components/Form/InputField";
import { useForm } from "react-hook-form";

const Page = (data) => {

// const   data={
//     username: "john_doe",
//     email: "john@example.com",
//     password: "password123",
//     firstName: "John",
//     lastName: "Doe",
//     phone: "123-456-7890",
//     address: "123 Main St",
//     bloodType: "O+",
//     birthday: "1990-01-01",
//     sex: "male",
//     img: "path/to/image.jpg",
//   }



const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

//


  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h1 className="text-xl font-semibold">Creater</h1>
      </div> */}
      <div className="flex flex-col gap-5.5 p-6.5">
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      
        <InputField
          label="Username"
          name="username"
          placeholder="name"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
      <button className="bg-blue-400 text-white p-2 rounded-md" onClick={onSubmit}>
        submit
      </button>
    </form>
      </div>
    </div>
  );
};

export default Page;
