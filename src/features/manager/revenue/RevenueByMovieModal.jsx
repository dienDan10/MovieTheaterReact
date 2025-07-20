import { Modal, Input } from "antd";
import { useState, useEffect } from "react";
import MovieRevenueItem from "./MovieRevenueItem";

function RevenueByMovieModal({ isOpen, onClose, movieStats }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Update filtered movies whenever search term or movieStats changes
  useEffect(() => {
    if (!movieStats) {
      setFilteredMovies([]);
      return;
    }

    const filtered = movieStats.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchTerm, movieStats]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Modal
      title="Doanh thu theo phim"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên phim"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieRevenueItem key={movie.movieId} movie={movie} />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? "Không tìm thấy phim nào" : "Không có dữ liệu"}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default RevenueByMovieModal;
