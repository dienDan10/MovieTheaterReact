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
  concessions: [],
  user: {
    username: null,
    email: null,
    phone: null,
  },
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
      const { theater, screen, showTime, movie, concessions } = action.payload;
      state.theater = theater;
      state.screen = screen;
      state.showtime = showTime;
      state.movie = movie;
      state.concessions = concessions.map((c) => ({ ...c, count: 0 })); // Initialize concession count to 0
    },
    increaseConcessionCount: (state, action) => {
      const concessionId = action.payload;
      const concession = state.concessions.find((c) => c.id === concessionId);
      if (concession) {
        concession.count += 1;
      }
    },
    decreaseConcessionCount: (state, action) => {
      const concessionId = action.payload;
      const concession = state.concessions.find((c) => c.id === concessionId);
      if (concession && concession.count > 0) {
        concession.count -= 1;
      }
    },
    setUserInformation: (state, action) => {
      const { username, email, phone } = action.payload;
      state.user.username = username || state.user.username;
      state.user.email = email || state.user.email;
      state.user.phone = phone || state.user.phone;
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
  increaseConcessionCount,
  decreaseConcessionCount,
  setUserInformation,
} = bookingSlice.actions;

export default bookingSlice.reducer;
