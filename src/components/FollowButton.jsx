
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../features/friends/friendsSlice";

const FollowButton = ({ userId }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends.friends);
  const isFollowing = friends.includes(userId);

  const handleClick = () => {
    if (isFollowing) {
      dispatch(unfollow(userId));
    } else {
      dispatch(follow(userId));
    }
  };

  return (
    <button
      onClick={handleClick}
      className={\`px-4 py-1 rounded text-sm text-white \${isFollowing ? "bg-gray-500" : "bg-green-500"} hover:opacity-80 transition\`}
    >
      {isFollowing ? "Удалить из друзей" : "Добавить в друзья"}
    </button>
  );
};

export default FollowButton;
