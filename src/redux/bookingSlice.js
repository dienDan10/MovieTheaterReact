import { createSlice } from "@reduxjs/toolkit";
import { MINIMUM_TOTAL_PRICE, POINTS_TO_VND_RATIO } from "../utils/constant";
import { format } from "date-fns";
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
  selectedPromotion: null,
  usePoints: false,
  pointsToUse: 0,
  user: {
    username: null,
    email: null,
    phone: null,
  },
  bookingHistoryFilter: {
    fromDate: format(new Date(), "yyyy-MM-dd"),
    toDate: format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
  },
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: () => initialState,
    setSeats: (state, action) => {
      // ...existing code...
      const seatsArray = Array.isArray(action.payload) ? action.payload : [];
      state.seats = seatsArray.map((seat) => ({ isSelected: false, ...seat }));
      const uniqueRows = [
        ...new Set(seatsArray.map((seat) => seat.seatRow)),
      ].sort();
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
      // ...existing code...
      const { theater, screen, showTime, movie, concessions } = action.payload;
      state.theater = theater;
      state.screen = screen;
      state.showtime = showTime;
      state.movie = movie;
      state.concessions = concessions.map((c) => ({ ...c, count: 0 }));
    },
    increaseConcessionCount: (state, action) => {
      // ...existing code...
      const concessionId = action.payload;
      const concession = state.concessions.find((c) => c.id === concessionId);
      if (concession) {
        concession.count += 1;
      }
    },
    decreaseConcessionCount: (state, action) => {
      // ...existing code...
      const concessionId = action.payload;
      const concession = state.concessions.find((c) => c.id === concessionId);
      if (concession && concession.count > 0) {
        concession.count -= 1;
      }
    },
    setUserInformation: (state, action) => {
      // ...existing code...
      const { username, email, phone } = action.payload;
      state.user.username = username || state.user.username;
      state.user.email = email || state.user.email;
      state.user.phone = phone || state.user.phone;
    },
    increaseStep: (state) => {
      // ...existing code...
      if (state.step < 3) state.step += 1;
    },
    decreaseStep: (state) => {
      // ...existing code...
      if (state.step > 1) state.step -= 1;
    },
    selectSeat: (state, action) => {
      // ...existing code...
      const seatId = action.payload;
      const seat = state.seats.find((s) => s.id === seatId);
      if (seat) {
        seat.isSelected = !seat.isSelected;
      }
    },
    setSelectedPromotion: (state, action) => {
      state.selectedPromotion = action.payload;
    },
    toggleUsePoints: (state, action) => {
      state.usePoints = action.payload;
      if (!action.payload) {
        state.pointsToUse = 0;
      }
    },
    setPointsToUse: (state, action) => {
      state.pointsToUse = action.payload;
    },
    // Calculate optimal points to use based on subtotal and promotion discount
    calculateOptimalPointsToUse: (state, action) => {
      const { subtotal, promotionDiscount, availablePoints } = action.payload;

      // Calculate maximum allowable discount from points
      const maxAllowableDiscount =
        subtotal - promotionDiscount - MINIMUM_TOTAL_PRICE;

      // Calculate how many points are needed for this discount
      const pointsNeeded = Math.ceil(
        maxAllowableDiscount / POINTS_TO_VND_RATIO
      );

      // Use only the points needed, capped by available points
      state.pointsToUse = Math.min(Math.max(0, pointsNeeded), availablePoints);
    },
    clearBookingDetail: (state) => {
      state.bookingDetail = null;
    },
    setBookingHistoryFilter: (state, action) => {
      // Merge new filter values with existing filter (like showtimeFilter)
      state.bookingHistoryFilter = {
        ...state.bookingHistoryFilter,
        ...action.payload,
      };
    },
    resetBookingHistoryFilter: (state) => {
      state.bookingHistoryFilter = initialState.bookingHistoryFilter;
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
  setSelectedPromotion,
  toggleUsePoints,
  setPointsToUse,
  calculateOptimalPointsToUse,
  clearBookingDetail,
  setBookingHistoryFilter,
  resetBookingHistoryFilter,
} = bookingSlice.actions;

export default bookingSlice.reducer;
