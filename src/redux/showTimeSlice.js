import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movieId: null,
  provinceId: 1, // Default to Ho Chi Minh City
  selectedDate: new Date().toISOString().split("T")[0], // Default to today
  // Cache for showtimes data
  showtimesCache: {},
};

const showtimeSlice = createSlice({
  name: "showtime",
  initialState,
  reducers: {
    setMovieId: (state, action) => {
      state.movieId = action.payload;
    },
    setProvinceId: (state, action) => {
      state.provinceId = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    cacheShowtimes: (state, action) => {
      const { key, data } = action.payload;
      state.showtimesCache[key] = {
        data,
        timestamp: Date.now(),
      };
    },
  },
});

export const { setMovieId, setProvinceId, setSelectedDate, cacheShowtimes } =
  showtimeSlice.actions;

export default showtimeSlice.reducer;
