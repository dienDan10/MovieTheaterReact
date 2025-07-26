import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    id: null,
    name: null,
    email: null,
    theaterId: null,
    role: null,
    point: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    doLoginAction: (state) => {
      state.isAuthenticated = true;
    },
    doGetProfileAction: (state, action) => {
      const { id, displayName, email, role, theaterId, point } = action.payload;
      state.user = { id, name: displayName, email, role, theaterId, point };
      state.isAuthenticated = true;
    },
    doLogoutAction: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user; // Reset user data
    },
  },
});

export const { doLoginAction, doGetProfileAction, doLogoutAction } =
  userSlice.actions;
export default userSlice.reducer;
