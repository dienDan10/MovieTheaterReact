import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "Employee",
  initialState: {
    filters: {
      name: "",
      email: "",
      theaterId: "",
      sortBy: "",
      isDescending: false,
      pageNumber: 1,
      pageSize: 10,
    },
    selectedEmployee: null,
    isFormVisible: false,
    formMode: "create", // create or edit
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
        theaterId: "",
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
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
    toggleFormVisibility: (state, action) => {
      state.isFormVisible =
        action.payload !== undefined ? action.payload : !state.isFormVisible;
    },
    setFormMode: (state, action) => {
      state.formMode = action.payload;
    },
    // No longer needed as we'll handle data operations with React Query hooks
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  setPageSize,
  setSorting,
  setSelectedEmployee,
  clearSelectedEmployee,
  toggleFormVisibility,
  setFormMode,
} = employeeSlice.actions;

export default employeeSlice.reducer;
