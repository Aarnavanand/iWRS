import React from "react";
import useColorMode from "../hooks/useColorMode";

const ColorModeComponent = () => {
  const [colorMode, setColorMode] = useColorMode();

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <div>
      <p>Current Color Mode: {colorMode}</p>
      <button onClick={toggleColorMode}>
        Toggle to {colorMode === "light" ? "dark" : "light"} mode
      </button>
    </div>
  );
};

export default ColorModeComponent;
