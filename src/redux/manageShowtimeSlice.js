import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

const initialState = {
  // Filter state
  filters: {
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    movieId: null,
    screenId: null,
  },
  // Showtime creation state
  newShowtime: {
    movieId: null,
    screenId: null,
    date: format(new Date(), "yyyy-MM-dd"),
    timeSlots: [], // { startTime, endTime }
    ticketPrice: 0,
    vipTicketPrice: 0,
  },
  // Selected showtime for detail view
  selectedShowtime: null,
  // UI state
  drawerVisible: false,
  loadingStates: {
    filter: false,
    create: false,
    update: false,
    delete: false,
  },
};

export const manageShowtimeSlice = createSlice({
  name: "manageShowtime",
  initialState,
  reducers: {
    // Filter actions
    setFilterStartDate: (state, action) => {
      state.filters.startDate = action.payload;
    },
    setFilterEndDate: (state, action) => {
      state.filters.endDate = action.payload;
    },
    setFilterMovieId: (state, action) => {
      state.filters.movieId = action.payload;
    },
    setFilterScreenId: (state, action) => {
      state.filters.screenId = action.payload;
    },
    resetFilters: (state) => {
      // Preserve the current screenId when resetting filters
      const currentScreenId = state.filters.screenId;
      state.filters = {
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        ),
        movieId: null,
        screenId: currentScreenId, // Maintain the current screenId
      };
    },

    // New showtime actions
    setNewShowtimeMovieId: (state, action) => {
      state.newShowtime.movieId = action.payload;
    },
    setNewShowtimeScreenId: (state, action) => {
      state.newShowtime.screenId = action.payload;
    },
    setNewShowtimeDate: (state, action) => {
      state.newShowtime.date = action.payload;
    },
    setNewShowtimeTicketPrice: (state, action) => {
      state.newShowtime.ticketPrice = action.payload;
    },
    setNewShowtimeVipTicketPrice: (state, action) => {
      state.newShowtime.vipTicketPrice = action.payload;
    },
    addTimeSlot: (state, action) => {
      state.newShowtime.timeSlots.push(action.payload);
    },
    removeTimeSlot: (state, action) => {
      state.newShowtime.timeSlots = state.newShowtime.timeSlots.filter(
        (_, index) => index !== action.payload
      );
    },
    resetNewShowtime: (state) => {
      state.newShowtime = {
        movieId: null,
        screenId: null,
        date: format(new Date(), "yyyy-MM-dd"),
        timeSlots: [],
        ticketPrice: 0,
        vipTicketPrice: 0,
      };
    },

    // Selected showtime actions
    setSelectedShowtime: (state, action) => {
      state.selectedShowtime = action.payload;
      state.drawerVisible = true;
    },
    clearSelectedShowtime: (state) => {
      state.selectedShowtime = null;
      state.drawerVisible = false;
    },

    // Loading states
    setLoading: (state, action) => {
      state.loadingStates[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  setFilterStartDate,
  setFilterEndDate,
  setFilterMovieId,
  setFilterScreenId,
  resetFilters,
  setNewShowtimeMovieId,
  setNewShowtimeScreenId,
  setNewShowtimeDate,
  setNewShowtimeTicketPrice,
  setNewShowtimeVipTicketPrice,
  addTimeSlot,
  removeTimeSlot,
  resetNewShowtime,
  setSelectedShowtime,
  clearSelectedShowtime,
  setLoading,
} = manageShowtimeSlice.actions;

export default manageShowtimeSlice.reducer;
