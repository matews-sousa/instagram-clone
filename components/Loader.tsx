import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="spinner-grow inline-block h-12 w-12 rounded-full bg-current opacity-0"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
