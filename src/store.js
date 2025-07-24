import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import pinReducer from "./features/pins/pinSlice";
import searchReducer from "./features/search/searchSlice";
import friendReducer from "./features/friends/friendsSlice.js";
import categoryReducer from "./features/category/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    pins: pinReducer,
    search: searchReducer,
    friends: friendReducer,
    category: categoryReducer,
  },
});

export default store;
