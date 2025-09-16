
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendFriendRequest } from "../features/friends/friendsSlice";

const FollowButton = ({ username }) => {
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.friends);
  const isFollowing = friends.some(friend => friend.username === username);

  const handleClick = () => {
    dispatch(sendFriendRequest(username));
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1 rounded text-sm text-white ${isFollowing ? "bg-gray-500" : "bg-green-500"} hover:opacity-80 transition`}
    >
      {isFollowing ? "Удалить из друзей" : "Добавить в друзья"}
    </button>
  );
};

export default FollowButton;
