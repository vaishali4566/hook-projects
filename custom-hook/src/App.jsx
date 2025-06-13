import React from "react";
import useToggle from "./hook/customHook";

function App() {
  const [isVisible, toggleVisibility] = useToggle();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <button
        onClick={toggleVisibility}
        className="px-6 py-2 mb-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
      >
        {isVisible ? "Hide Text" : "Show Text"}
      </button>

      {isVisible && (
        <h2 className="text-2xl font-semibold text-blue-800">
          This is toggled text!
        </h2>
      )}
    </div>
  );
}

export default App;