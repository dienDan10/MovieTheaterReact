import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "Customer",
  initialState: {
    filters: {
      name: "",
      email: "",
      sortBy: "",
      isDescending: false,
      pageNumber: 1,
      pageSize: 10,
    },
    selectedCustomer: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        ...state.filters,
        name: "",
        email: "",
        sortBy: "",
        isDescending: false,
      };
    },
    setPage: (state, action) => {
      state.filters.pageNumber = action.payload;
    },
    setPageSize: (state, action) => {
      state.filters.pageSize = action.payload;
    },
    setSorting: (state, action) => {
      const { sortBy, isDescending } = action.payload;
      state.filters.sortBy = sortBy;
      state.filters.isDescending = isDescending;
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    // No data operations here as we'll handle with React Query
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  setPageSize,
  setSorting,
  setSelectedCustomer,
  clearSelectedCustomer,
} = customerSlice.actions;

export default customerSlice.reducer;
