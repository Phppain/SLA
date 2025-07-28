import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600">@{user.username}</p>
    </div>
  );
};

export default UserCard;
