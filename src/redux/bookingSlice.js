import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  seatRows: ["A", "B", "C", "D", "E", "F"],
  seatColumns: [1, 2, 3, 4, 5, 6],
  seats: [
    {
      id: 1,
      seatNumber: 1,
      seatRow: "A",
      isBooked: true,
      isActive: true,
      isSelected: false,
    },
    {
      id: 2,
      seatNumber: 2,
      seatRow: "A",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 3,
      seatNumber: 3,
      seatRow: "A",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 4,
      seatNumber: 4,
      seatRow: "A",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 5,
      seatNumber: 5,
      seatRow: "A",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 6,
      seatNumber: 6,
      seatRow: "A",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 7,
      seatNumber: 1,
      seatRow: "B",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 8,
      seatNumber: 2,
      seatRow: "B",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 9,
      seatNumber: 3,
      seatRow: "B",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 10,
      seatNumber: 4,
      seatRow: "B",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 11,
      seatNumber: 5,
      seatRow: "B",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 12,
      seatNumber: 6,
      seatRow: "B",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 13,
      seatNumber: 1,
      seatRow: "C",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 14,
      seatNumber: 2,
      seatRow: "C",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 15,
      seatNumber: 3,
      seatRow: "C",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 16,
      seatNumber: 4,
      seatRow: "C",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 17,
      seatNumber: 5,
      seatRow: "C",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
    {
      id: 18,
      seatNumber: 6,
      seatRow: "C",
      isBooked: false,
      isActive: true,
      isSelected: false,
    },
  ],
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: () => {
      return initialState;
    },
    increaseStep: (state) => {
      if (state.step < 3) state.step += 1;
    },
    decreaseStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    selectSeat: (state, action) => {
      const seatId = action.payload;
      const seat = state.seats.find((s) => s.id === seatId);
      if (seat && seat.isActive) {
        seat.isSelected = !seat.isSelected;
      }
    },
  },
});

export const { resetBookingState, increaseStep, decreaseStep, selectSeat } =
  bookingSlice.actions;

export default bookingSlice.reducer;
