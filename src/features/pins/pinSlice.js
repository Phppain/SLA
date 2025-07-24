import { createSlice, nanoid } from "@reduxjs/toolkit";

const savedPins = JSON.parse(localStorage.getItem("pins"));

const initialState = {
  pins: savedPins || [],
};

const pinSlice = createSlice({
  name: "pins",
  initialState,
  reducers: {
    addPin: {
      reducer: (state, action) => {
        state.pins.push(action.payload);
        localStorage.setItem("pins", JSON.stringify(state.pins));
      },
      prepare: (title, image, username, category) => ({
        payload: {
          id: nanoid(),
          title,
          image,
          username,
          category,
        },
      }),
    },
    editPin: (state, action) => {
      const { id, title, image } = action.payload;
      const existing = state.pins.find((pin) => pin.id === id);
      if (existing) {
        existing.title = title;
        existing.image = image;
        localStorage.setItem("pins", JSON.stringify(state.pins));
      }
    },
    deletePin: (state, action) => {
      state.pins = state.pins.filter((pin) => pin.id !== action.payload);
      localStorage.setItem("pins", JSON.stringify(state.pins));
    },
  },
});

export const { addPin, editPin, deletePin } = pinSlice.actions;
export default pinSlice.reducer;