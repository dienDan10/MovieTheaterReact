import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";

// eslint-disable-next-line react/prop-types
function MoviesGrid({ category = "current" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample movie data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleMovies = [
        {
          id: 1,
          title: "Avengers: The Final Chapter",
          poster: "/background.jpg",
          duration: "2h 35m",
          releaseYear: 2025,
          rating: 9.1,
          category: "current",
        },
        {
          id: 2,
          title: "The Dark Space",
          poster: "/background.jpg",
          duration: "1h 55m",
          releaseYear: 2025,
          rating: 8.7,
          category: "current",
        },
        {
          id: 3,
          title: "Into the Wilderness",
          poster: "/background.jpg",
          duration: "2h 10m",
          releaseYear: 2025,
          rating: 8.3,
          category: "current",
        },
        {
          id: 4,
          title: "Beyond the Horizon",
          poster: "/background.jpg",
          duration: "2h 15m",
          releaseYear: 2025,
          rating: 7.9,
          category: "current",
        },
        {
          id: 5,
          title: "Dawn of Time",
          poster: "/background.jpg",
          duration: "1h 50m",
          releaseYear: 2025,
          rating: 8.5,
          category: "upcoming",
        },
        {
          id: 6,
          title: "The Last Stand",
          poster: "/background.jpg",
          duration: "2h 05m",
          releaseYear: 2025,
          rating: 8.2,
          category: "upcoming",
        },
        {
          id: 7,
          title: "Eternal Sunshine",
          poster: "/background.jpg",
          duration: "1h 45m",
          releaseYear: 2025,
          rating: 8.9,
          category: "current",
        },
        {
          id: 8,
          title: "Midnight Chronicles",
          poster: "/background.jpg",
          duration: "2h 20m",
          releaseYear: 2025,
          rating: 8.4,
          category: "upcoming",
        },
      ];

      // Filter movies by category
      const filteredMovies =
        category === "all"
          ? sampleMovies
          : sampleMovies.filter((movie) => movie.category === category);

      setMovies(filteredMovies);
      setLoading(false);
    }, 800); // Simulate loading delay
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {movies.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-300 text-lg">
            No movies available in this category.
          </p>
        </div>
      )}
    </div>
  );
}

export default MoviesGrid;
