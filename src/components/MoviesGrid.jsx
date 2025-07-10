import MovieCard from "./MovieCard";
import useGetAiringMovies from "../layouts/home/useGetAiringMovies";
import useGetUpcomingMovies from "../layouts/home/useGetUpcomingMovies";

// Props validation is handled by TypeScript or PropTypes elsewhere
function MoviesGrid({ category = "current" }) {
  const { data: airingMoviesData, isLoading: isLoadingAiring } =
    useGetAiringMovies();

  const { data: upcomingMoviesData, isLoading: isLoadingUpcoming } =
    useGetUpcomingMovies();

  // Determine which movies to show based on category
  const movies =
    category === "current"
      ? airingMoviesData?.data || []
      : upcomingMoviesData?.data || [];

  // Check if data is loading
  const isLoading =
    category === "current" ? isLoadingAiring : isLoadingUpcoming;

  if (isLoading) {
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
          <MovieCard
            key={movie.id}
            movie={{
              id: movie.id,
              title: movie.title,
              poster: movie.posterUrl,
              duration: `${movie.duration} min`,
              releaseYear: new Date(movie.releaseDate).getFullYear(),
              rating: movie.rating || 8.0, // Default rating if not provided
            }}
          />
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
