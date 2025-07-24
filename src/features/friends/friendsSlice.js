
import { createSlice } from "@reduxjs/toolkit";

const savedFriends = JSON.parse(localStorage.getItem("friends"));

const initialState = {
  list: savedFriends || [],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend: (state, action) => {
      if (!state.list.includes(action.payload)) {
        state.list.push(action.payload);
        localStorage.setItem("friends", JSON.stringify(state.list));
      }
    },
    removeFriend: (state, action) => {
      state.list = state.list.filter((f) => f !== action.payload);
      localStorage.setItem("friends", JSON.stringify(state.list));
    },
  },
});

export const { addFriend, removeFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
