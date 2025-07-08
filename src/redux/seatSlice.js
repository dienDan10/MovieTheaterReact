import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seats: [],
  selectedTheaterId: null,
  selectedScreenId: null,
  loading: false,
  error: null,
  seatRows: [], // Unique row identifiers (A, B, C...)
  seatColumns: [], // Numbers 1, 2, 3...
};

export const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    setSeats: (state, action) => {
      // Ensure payload is an array
      const seatsArray = Array.isArray(action.payload) ? action.payload : [];
      state.seats = seatsArray;

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
    setSelectedTheaterId: (state, action) => {
      state.selectedTheaterId = action.payload;
      // Reset screen and seats when theater changes
      state.selectedScreenId = null;
      state.seats = [];
      state.seatRows = [];
      state.seatColumns = [];
    },
    setSelectedScreenId: (state, action) => {
      state.selectedScreenId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetSeatState: () => {
      return initialState;
    },
  },
});

export const {
  setSeats,
  setSelectedTheaterId,
  setSelectedScreenId,
  setLoading,
  setError,
  resetSeatState,
} = seatSlice.actions;

export default seatSlice.reducer;
