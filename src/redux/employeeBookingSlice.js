import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activity: "showtime", // activity can be 'showtime', 'ticket' or 'booking', default is 'showtime'
  filters: {
    theaterId: null,
    date: null,
  },
  selectedShowtime: null,
  paymentId: null,
  paymentDetails: null,
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
      state.paymentId = null;
      state.paymentDetails = null;
      state.selectedShowtime = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedShowtime: (state, action) => {
      state.selectedShowtime = action.payload;
    },
    setPaymentId: (state, action) => {
      state.paymentId = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
  },
});

export const {
  setActivity,
  resetActivity,
  setFilters,
  setSelectedShowtime,
  setPaymentId,
  setPaymentDetails,
} = employeeBookingSlice.actions;
export default employeeBookingSlice.reducer;
