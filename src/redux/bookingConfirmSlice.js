import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  verificationStatus: "pending", // pending, success, error
  errorMessage: null,
  paymentId: null,
  paymentDetails: null,
};

const bookingConfirmSlice = createSlice({
  name: "bookingConfirm",
  initialState,
  reducers: {
    startVerification: (state) => {
      state.verificationStatus = "pending";
      state.errorMessage = null;
    },
    verificationSuccess: (state, action) => {
      state.verificationStatus = "success";
      state.paymentId = action.payload.paymentId;
      state.errorMessage = null;
    },
    verificationFailed: (state, action) => {
      state.verificationStatus = "error";
      state.errorMessage = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
    resetBookingConfirm: () => initialState,
  },
});

export const {
  startVerification,
  verificationSuccess,
  verificationFailed,
  setPaymentDetails,
  resetBookingConfirm,
} = bookingConfirmSlice.actions;

export default bookingConfirmSlice.reducer;
