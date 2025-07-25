import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // For promotion details drawer
  detailsVisible: false,
  selectedPromotion: null,
  // For create/edit form
  formVisible: false,
  formMode: "create", // "create" or "edit"
};

export const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {
    // Details drawer actions
    toggleDetailsVisibility: (state, action) => {
      state.detailsVisible =
        action.payload !== undefined ? action.payload : !state.detailsVisible;
    },
    setSelectedPromotion: (state, action) => {
      state.selectedPromotion = action.payload;
    },
    clearSelectedPromotion: (state) => {
      state.selectedPromotion = null;
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
  setSelectedPromotion,
  clearSelectedPromotion,
  toggleFormVisibility,
  setFormMode,
} = promotionSlice.actions;

export default promotionSlice.reducer;
