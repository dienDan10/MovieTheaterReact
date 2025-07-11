import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // For concession details drawer
  detailsVisible: false,
  selectedConcession: null,
  // For create/edit form
  formVisible: false,
  formMode: "create", // "create" or "edit"
};

export const concessionSlice = createSlice({
  name: "concession",
  initialState,
  reducers: {
    // Details drawer actions
    toggleDetailsVisibility: (state, action) => {
      state.detailsVisible =
        action.payload !== undefined ? action.payload : !state.detailsVisible;
    },
    setSelectedConcession: (state, action) => {
      state.selectedConcession = action.payload;
    },
    clearSelectedConcession: (state) => {
      state.selectedConcession = null;
    },

    // Form actions
    toggleFormVisibility: (state, action) => {
      state.formVisible =
        action.payload !== undefined ? action.payload : !state.formVisible;
    },
    setFormMode: (state, action) => {
      state.formMode = action.payload;
    },
  },
});

export const {
  toggleDetailsVisibility,
  setSelectedConcession,
  clearSelectedConcession,
  toggleFormVisibility,
  setFormMode,
} = concessionSlice.actions;

export default concessionSlice.reducer;
