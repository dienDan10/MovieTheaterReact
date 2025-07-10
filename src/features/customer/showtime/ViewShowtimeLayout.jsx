import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMovieId } from "../../../redux/showtimeSlice";
import MovieHero from "./MovieHero";
import ShowtimeList from "./ShowtimeList";

function ViewShowtimeLayout() {
  const { movieId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (movieId) {
      dispatch(setMovieId(parseInt(movieId)));
    }
  }, [dispatch, movieId]);

  return (
    <div className="bg-stone-100 pb-20">
      <MovieHero />
      <ShowtimeList />
    </div>
  );
}

export default ViewShowtimeLayout;
