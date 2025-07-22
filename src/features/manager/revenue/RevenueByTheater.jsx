import { useState } from "react";
import TheaterRevenueItem from "./TheaterRevenueItem";
import RevenueByTheaterModal from "./RevenueByTheaterModal";

function RevenueByTheater({ revenue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theaterStats = {};
  revenue.forEach(({ payment, movie }) => {
    const { theaterId, theaterName, amount } = payment;
    if (!theaterStats[theaterId]) {
      theaterStats[theaterId] = {
        theaterId,
        theaterName: theaterName.trim(),
        totalTicketCount: 0,
        totalRevenue: 0,
      };
    }
    theaterStats[theaterId].totalRevenue += amount;
    theaterStats[theaterId].totalTicketCount += movie.ticketCount;
  });

  const result = Object.values(theaterStats).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-3 bg-white p-4 rounded-md shadow-md mb-6 mt-6">
      <div className="flex justify-between items-center border-b border-neutral-200">
        <h2 className="text-lg font-semibold mb-4">Doanh thu theo rạp</h2>
        <p
          className="text-gray-600 hover:underline cursor-pointer"
          onClick={handleOpenModal}
        >
          Xem tất cả
        </p>
      </div>

      {result.slice(0, 3).map((theater) => (
        <TheaterRevenueItem key={theater.theaterId} theater={theater} />
      ))}

      <RevenueByTheaterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        theaterStats={result}
      />
    </div>
  );
}

export default RevenueByTheater;
