import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activity: "showtime", // activity can be 'showtime' or 'booking', default is 'showtime'
  filters: {
    theaterId: null,
    date: null,
  },
  selectedShowtime: null,
};

export const employeeBookingSlice = createSlice({
  name: "employeeBooking",
  initialState,
  reducers: {
    setActivity: (state, action) => {
      state.activity = action.payload;
    },
    resetActivity: (state) => {
      state.activity = "showtime"; // Reset to default activity
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedShowtime: (state, action) => {
      state.selectedShowtime = action.payload;
    },
  },
});

export const { setActivity, resetActivity, setFilters, setSelectedShowtime } =
  employeeBookingSlice.actions;
export default employeeBookingSlice.reducer;
