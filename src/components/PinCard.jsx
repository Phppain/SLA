import React from "react";

const PinCard = ({ pin, onClick }) => {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-white cursor-pointer"
      onClick={() => onClick(pin)}
    >
      <img
        src={pin.image}
        alt={pin.title}
        className="w-full h-[300px] object-cover rounded-t-2xl"
      />
      <div className="px-3 py-2 flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-800">{pin.title}</p>
        <div className="flex gap-2">
          <button className="hover:text-red-500 transition">❤️</button>
          <button className="hover:text-blue-500 transition">💬</button>
        </div>
      </div>
    </div>
  );
};

export default PinCard;