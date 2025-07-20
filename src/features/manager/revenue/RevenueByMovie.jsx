import { useState } from "react";
import MovieRevenueItem from "./MovieRevenueItem";
import RevenueByMovieModal from "./RevenueByMovieModal";

function RevenueByMovie({ revenue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const movieStatsMap = {};

  revenue.forEach((item) => {
    const { id: movieId, title } = item.movie;
    const { ticketCount, amount } = item.payment;

    if (!movieStatsMap[movieId]) {
      movieStatsMap[movieId] = {
        movieId,
        title: title.trim(),
        ticketCount: 0,
        revenue: 0,
      };
    }

    movieStatsMap[movieId].ticketCount += ticketCount;
    movieStatsMap[movieId].revenue += amount;
  });

  const result = Object.values(movieStatsMap).sort(
    (a, b) => b.revenue - a.revenue
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-6 mt-6">
      <div className="flex justify-between items-center border-b border-neutral-200">
        <h2 className="text-lg font-semibold mb-4">Doanh thu theo phim</h2>
        <p
          className="text-gray-600 hover:underline cursor-pointer"
          onClick={handleOpenModal}
        >
          Xem tất cả
        </p>
      </div>
      {result.slice(0, 3).map((movie) => (
        <MovieRevenueItem key={movie.movieId} movie={movie} />
      ))}

      <RevenueByMovieModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        movieStats={result}
      />
    </div>
  );
}

export default RevenueByMovie;
