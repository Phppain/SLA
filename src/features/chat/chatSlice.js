
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: {
    // Пример структуры: userId: [{ from: myId, to: userId, text }]
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const { from, to, text } = action.payload;
      if (!state.messages[to]) {
        state.messages[to] = [];
      }
      state.messages[to].push({ from, to, text });
    },
  },
});

export const { sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
