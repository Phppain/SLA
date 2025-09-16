import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import pinReducer from "./features/pins/pinSlice";
import searchReducer from "./features/search/searchSlice";
import friendReducer from "./features/friends/friendsSlice.js";
import categoryReducer from "./features/category/categorySlice";
import usersReducer from './features/users/userSlice';
import modalReducer from "./features/modal/modalSlice";
import chatReducer from "./features/chat/chatSlice";
import notificationReducer from "./features/notifications/notificationsSlice";
import interactionsReducer from "./features/interactions/likeCommentSlice";

const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
    pins: pinReducer,
    friends: friendReducer,
    category: categoryReducer,
    users: usersReducer,
    modal: modalReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    interactions: interactionsReducer,
  },
});

export default store;
