import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activity: "showtime", // activity can be 'showtime' or 'booking', default is 'showtime'
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
  },
});

export const { setActivity, resetActivity } = employeeBookingSlice.actions;
export default employeeBookingSlice.reducer;
