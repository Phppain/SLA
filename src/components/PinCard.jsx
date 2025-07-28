import React from "react";

const PinCard = ({ pin }) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl bg-white transition-shadow duration-300">
      <div className="w-full h-60 overflow-hidden">
        <img
          src={pin.image}
          alt={pin.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-base font-semibold">{pin.title}</h3>
        <p className="text-sm text-gray-600 truncate">{pin.description}</p>
      </div>
    </div>
  );
};

export default PinCard;
