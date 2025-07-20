import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

// default date range: today to 10 days later
// format: yyyy-MM-dd
const initialState = {
  filters: {
    startDate: format(new Date() - 10 * 24 * 60 * 60 * 1000, "yyyy-MM-dd"),
    endDate: format(new Date(Date.now()), "yyyy-MM-dd"),
    theaterId: null,
  },
};

export const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setFilterStartDate: (state, action) => {
      state.filters.startDate = action.payload;
    },
    setFilterEndDate: (state, action) => {
      state.filters.endDate = action.payload;
    },
    setFilterTheaterId: (state, action) => {
      state.filters.theaterId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  setFilterEndDate,
  setFilterStartDate,
  setFilterTheaterId,
} = revenueSlice.actions;
export default revenueSlice.reducer;
