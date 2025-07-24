import React, { useEffect } from "react";
import { Card, Spin, Empty } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useGetSeats } from "./useGetSeats";
import SeatItem from "./SeatItem";
import { setSeats, setLoading, setError } from "../../../redux/seatSlice";

const SeatGrid = () => {
  const dispatch = useDispatch();
  const { selectedScreenId, seatRows, seatColumns, seats, loading } =
    useSelector((state) => state.seat);
  const {
    seats: fetchedSeats,
    isLoading,
    error,
    refetch,
  } = useGetSeats(selectedScreenId);

  // Fetch seats when screen changes
  useEffect(() => {
    if (selectedScreenId) {
      refetch();
    }
  }, [selectedScreenId, refetch]);

  // Process and dispatch seats data
  useEffect(() => {
    if (fetchedSeats && fetchedSeats.length > 0) {
      // Sort seats by row then by number
      const sortedSeats = [...fetchedSeats].sort((a, b) => {
        // sort by seat number if row is the same
        if (a.seatRow === b.seatRow) {
          return a.seatNumber - b.seatNumber;
        }

        // sort by row name if seat number is the same
        return a.seatRow.localeCompare(b.seatRow);
      });

      dispatch(setSeats(sortedSeats));
    }
  }, [fetchedSeats, dispatch]);

  // Handle loading state
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  // Handle error state
  useEffect(() => {
    if (error) {
      dispatch(setError(error?.message || "An error occurred fetching seats"));
    }
  }, [error, dispatch]);

  if (loading || isLoading) {
    return (
      <Card title="Screen Layout" size="small" className="mt-4">
        <div className="flex justify-center items-center p-8">
          <Spin tip="Loading seats..." />
        </div>
      </Card>
    );
  }

  if (!seats || seats.length === 0) {
    return (
      <Card title="Screen Layout" size="small" className="mt-4">
        <Empty
          description={`No seats found for screen ID: ${selectedScreenId}`}
        />
      </Card>
    );
  }

  return (
    <Card title="Screen Layout" size="small" className="mt-4">
      {/* Screen display */}
      <div className="w-full mb-8 relative">
        <div className="h-8 bg-gray-300 flex items-center justify-center rounded-t-lg shadow-md mb-8">
          <div className="text-center font-medium text-gray-800">SCREEN</div>
        </div>
      </div>

      {/* Seats grid */}
      <div className="flex flex-col items-center gap-4">
        {seatRows.map((row) => (
          <div key={row} className="flex items-center">
            {/* Row label */}
            <div className="w-6 mr-4 font-bold text-center">{row}</div>

            {/* Seats for this row */}
            <div className="flex gap-2">
              {seatColumns.map((col) => {
                const seat = seats.find(
                  (s) => s.seatRow === row && s.seatNumber === col
                );

                if (!seat)
                  return (
                    <div
                      key={`empty-${row}-${col}`}
                      className="w-10 h-10"
                    ></div>
                  );

                return <SeatItem key={seat.id} seat={seat} />;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Seat legend */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-center font-medium mb-4">Seat Status Legend</h3>
        <div className="flex justify-center gap-8">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
            <span>Normal Seat</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
            <span>VIP Seat</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
            <span>Disabled Seat</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SeatGrid;
