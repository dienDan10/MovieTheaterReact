import { createSlice } from "@reduxjs/toolkit";

const screenSlice = createSlice({
  name: "Screen",
  initialState: {
    selectedTheaterId: "",
    selectedScreen: null,
    isFormVisible: false,
    formMode: "create", // create or edit
  },
  reducers: {
    setSelectedTheaterId: (state, action) => {
      state.selectedTheaterId = action.payload;
    },
    setSelectedScreen: (state, action) => {
      state.selectedScreen = action.payload;
    },
    clearSelectedScreen: (state) => {
      state.selectedScreen = null;
    },
    toggleFormVisibility: (state, action) => {
      state.isFormVisible =
        action.payload !== undefined ? action.payload : !state.isFormVisible;
    },
    setFormMode: (state, action) => {
      state.formMode = action.payload;
    },
  },
});

export const {
  setSelectedTheaterId,
  setSelectedScreen,
  clearSelectedScreen,
  toggleFormVisibility,
  setFormMode,
} = screenSlice.actions;

export default screenSlice.reducer;
