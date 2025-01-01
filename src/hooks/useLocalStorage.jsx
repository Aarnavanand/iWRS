"use client";
import React from "react";
import useLocalStorage from "./useLocalStorage";

const LocalStorageForm = () => {
  const [name, setName] = useLocalStorage("name", "");
  const [age, setAge] = useLocalStorage("age", 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Name: ${name}, Age: ${age}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default LocalStorageForm;
