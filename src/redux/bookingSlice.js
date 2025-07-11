import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  seatRows: [],
  seatColumns: [],
  seats: [],
  theater: null,
  screen: null,
  showtime: null,
  movie: null,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: () => {
      return initialState;
    },
    setSeats: (state, action) => {
      // Ensure payload is an array
      const seatsArray = Array.isArray(action.payload) ? action.payload : [];
      state.seats = seatsArray.map((seat) => ({ isSelected: false, ...seat }));

      // Extract unique rows and maximum column number
      const uniqueRows = [
        ...new Set(seatsArray.map((seat) => seat.seatRow)),
      ].sort();

      // Find max column number for each row
      const maxColumnNumber =
        seatsArray.length > 0
          ? Math.max(...seatsArray.map((seat) => seat.seatNumber), 0)
          : 0;

      const seatColumns = Array.from(
        { length: maxColumnNumber },
        (_, i) => i + 1
      );

      state.seatRows = uniqueRows;
      state.seatColumns = seatColumns;
    },
    setShowtimeData: (state, action) => {
      const { theater, screen, showTime, movie } = action.payload;
      state.theater = theater;
      state.screen = screen;
      state.showtime = showTime;
      state.movie = movie;
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
      if (seat) {
        seat.isSelected = !seat.isSelected;
      }
    },
  },
});

export const {
  resetBookingState,
  increaseStep,
  decreaseStep,
  selectSeat,
  setSeats,
  setShowtimeData,
} = bookingSlice.actions;

export default bookingSlice.reducer;
