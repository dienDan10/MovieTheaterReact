import { useState } from "react";
import MovieRevenueItem from "./MovieRevenueItem";
import RevenueByMovieModal from "./RevenueByMovieModal";

function RevenueByMovie({ revenue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const movieStats = {};

  revenue.forEach(({ movie }) => {
    const { id, title, ticketCount, amount } = movie;

    if (!movieStats[id]) {
      movieStats[id] = {
        movieId: id,
        title: title.trim(),
        ticketCount: 0,
        revenue: 0,
      };
    }

    movieStats[id].ticketCount += ticketCount;
    movieStats[id].revenue += amount;
  });

  const result = Object.values(movieStats).sort(
    (a, b) => b.revenue - a.revenue
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-4 bg-white p-4 rounded-md shadow-md mb-6 mt-6">
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
