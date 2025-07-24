import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingHistoryTable from "./BookingHistoryTable";
import { fetchBookingHistory } from "../../../redux/bookingSlice";

function BookingHistoryPage() {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchBookingHistory());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-xl font-bold mb-4">Booking History</h2>
      <BookingHistoryTable data={history} loading={loading} error={error} />
    </div>
  );
}

export default BookingHistoryPage;
