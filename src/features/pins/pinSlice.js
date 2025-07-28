// src/features/pins/pinSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";

// Загружаем начальное состояние из localStorage
const storedPins = localStorage.getItem("pins");
const initialState = {
  pins: storedPins ? JSON.parse(storedPins) : [],
};

const pinSlice = createSlice({
  name: "pins",
  initialState,
  reducers: {
    addPin: (state, action) => {
      const newPin = {
        ...action.payload,
        likes: [], // <-- исправлено
        comments: [], // <-- каждый комментарий будет объектом
      };
      state.pins.push(newPin);
      localStorage.setItem("pins", JSON.stringify(state.pins));
    },
    toggleLike: (state, action) => {
      const { pinId, userId } = action.payload;
      const pin = state.pins.find((p) => p.id === pinId);
      if (pin) {
        if (!Array.isArray(pin.likes)) pin.likes = [];
        const index = pin.likes.indexOf(userId);
        if (index !== -1) {
          pin.likes.splice(index, 1);
        } else {
          pin.likes.push(userId);
        }
        localStorage.setItem("pins", JSON.stringify(state.pins));
      }
    },
    deletePin: (state, action) => {
      state.pins = state.pins.filter(pin => pin.id !== action.payload);
      localStorage.setItem("pins", JSON.stringify(state.pins));
    },
    addComment: (state, action) => {
      const { id, comment } = action.payload;
      const pin = state.pins.find(pin => pin.id === id);
      if (pin) {
        pin.comments.push({ id: nanoid(), ...comment });
        localStorage.setItem("pins", JSON.stringify(state.pins));
      }
    },
    editComment: (state, action) => {
      const { pinId, commentId, newText } = action.payload;
      const pin = state.pins.find(pin => pin.id === pinId);
      if (pin) {
        const comment = pin.comments.find(c => c.id === commentId);
        if (comment) {
          comment.text = newText;
          localStorage.setItem("pins", JSON.stringify(state.pins));
        }
      }
    },
    deleteComment: (state, action) => {
      const { pinId, commentId } = action.payload;
      const pin = state.pins.find(pin => pin.id === pinId);
      if (pin) {
        pin.comments = pin.comments.filter(c => c.id !== commentId);
        localStorage.setItem("pins", JSON.stringify(state.pins));
      }
    },
  },
});

export const {
  addPin,
  toggleLike,
  deletePin,
  addComment,
  editComment,
  deleteComment,
} = pinSlice.actions;

export default pinSlice.reducer;
