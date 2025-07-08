import MovieHero from "./MovieHero";
import Showtime from "./Showtime";
import ShowtimeList from "./ShowtimeList";

function ViewShowtimeLayout() {
  return (
    <div className="bg-stone-100 pb-20">
      <MovieHero />
      <ShowtimeList />
    </div>
  );
}

export default ViewShowtimeLayout;
