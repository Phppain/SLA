
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likes: {},        // { pinId: [userId, userId] }
  comments: {},     // { pinId: [{ userId, text }] }
};

const likeCommentSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const { pinId, userId } = action.payload;
      const existing = state.likes[pinId] || [];
      if (existing.includes(userId)) {
        state.likes[pinId] = existing.filter(id => id !== userId);
      } else {
        state.likes[pinId] = [...existing, userId];
      }
    },
    addComment: (state, action) => {
      const { pinId, userId, text } = action.payload;
      const comment = { userId, text };
      if (!state.comments[pinId]) {
        state.comments[pinId] = [comment];
      } else {
        state.comments[pinId].push(comment);
      }
    },
  },
});

export const { toggleLike, addComment } = likeCommentSlice.actions;
export default likeCommentSlice.reducer;
