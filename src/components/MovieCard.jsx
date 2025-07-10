import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
      {/* Movie Poster */}
      <div className="relative">
        <img
          src={movie.poster || "/background.jpg"}
          alt={`${movie.title} poster`}
          className="w-full h-64 object-cover"
        />

        {/* Overlay with Book Ticket button on hover */}
        <div
          className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100`}
        >
          <Link
            to={`/showtimes/${movie.id}`}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
          >
            Book Ticket
          </Link>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 bg-neutral-900">
        <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
        <div className="flex justify-between mt-2 text-gray-300 text-sm">
          <span>{movie.duration}</span>
          <span>{movie.releaseYear}</span>
        </div>
        <div className="mt-2 flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-gray-300 text-sm">{movie.rating}/10</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
