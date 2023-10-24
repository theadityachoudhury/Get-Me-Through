import React from "react";

const Card = ({ title, description }) => {
  return (
    <div className="w-96 h-96 rounded-lg shadow-xxl bg-gray-300">
      <div className="font-bold text-2xl mb-4">{title}</div>
      <p className="text-gray-700 text-base">{description}</p>
      <div className="mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Card;
