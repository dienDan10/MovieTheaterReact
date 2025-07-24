import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBookingHistory, getBookingDetails, cancelBooking as cancelBookingApi } from "../services/apiBooking";

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
  history: [],
  bookingDetail: null,
  loading: false,
  loadingDetail: false,
  error: null,
};

// Thunk: fetch booking history
export const fetchBookingHistory = createAsyncThunk(
  "booking/fetchBookingHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBookingHistory();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi lấy lịch sử giao dịch");
    }
  }
);

// Thunk: fetch booking detail
export const fetchBookingDetail = createAsyncThunk(
  "booking/fetchBookingDetail",
  async (paymentId, { rejectWithValue }) => {
    try {
      const res = await getBookingDetails(paymentId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi lấy chi tiết giao dịch");
    }
  }
);

// Thunk: cancel booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (paymentId, { rejectWithValue }) => {
    try {
      await cancelBookingApi(paymentId);
      return paymentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi huỷ giao dịch");
    }
  }
);
export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: () => initialState,
    setSeats: (state, action) => {
      // ...existing code...
      const seatsArray = Array.isArray(action.payload) ? action.payload : [];
      state.seats = seatsArray.map((seat) => ({ isSelected: false, ...seat }));
      const uniqueRows = [...new Set(seatsArray.map((seat) => seat.seatRow))].sort();
      const maxColumnNumber = seatsArray.length > 0 ? Math.max(...seatsArray.map((seat) => seat.seatNumber), 0) : 0;
      const seatColumns = Array.from({ length: maxColumnNumber }, (_, i) => i + 1);
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
    clearBookingDetail: (state) => {
      state.bookingDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchBookingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookingDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchBookingDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.bookingDetail = action.payload;
      })
      .addCase(fetchBookingDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        // Xoá booking khỏi history khi huỷ thành công
        state.history = state.history.filter((b) => b.paymentId !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
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
  clearBookingDetail,
} = bookingSlice.actions;

export default bookingSlice.reducer;
