import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/userSlice";

const store = configureStore({
  reducer: {
    // Add your reducers here
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable data
    }),
});
export default store;
