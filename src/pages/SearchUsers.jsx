import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/users/userSlice";
import { setQuery } from "../features/search/searchSlice";
import UserCard from "../components/UserCard";

const SearchUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const query = useSelector((state) => state.search.query);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Найти друзей</h1>
      {filteredUsers.length === 0 ? (
        <p>Нет пользователей по вашему запросу.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
