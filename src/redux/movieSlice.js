import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // For filtering
  filters: {
    title: "",
    pageNumber: 1,
    pageSize: 10,
  },
  // For movie details drawer
  detailsVisible: false,
  selectedMovie: null,
  // For create/edit form
  formVisible: false,
  formMode: "create", // "create" or "edit"
};

export const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
    },

    // Details drawer actions
    toggleDetailsVisibility: (state, action) => {
      state.detailsVisible =
        action.payload !== undefined ? action.payload : !state.detailsVisible;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
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
  setFilters,
  resetFilters,
  toggleDetailsVisibility,
  setSelectedMovie,
  clearSelectedMovie,
  toggleFormVisibility,
  setFormMode,
} = movieSlice.actions;

export default movieSlice.reducer;
