import Slider from "react-slick";
import SliderNextArrow from "./SliderNextArrow";
import SliderPrevArrow from "./SliderPrevArrow";
import useGetAiringMovies from "../layouts/home/useGetAiringMovies";

function HomeSlider() {
  const { data: airingMoviesData, isLoading } = useGetAiringMovies();

  // Get up to 5 movies for the slider
  const movies = airingMoviesData?.data?.slice(0, 5) || [];

  // Fallback images in case API doesn't return data
  const fallbackImages = [
    "/background.jpg",
    "/images/slider1.jpg",
    "/images/slider2.jpg",
    "/images/slider3.jpg",
    "/images/slider3.jpg",
  ];

  // Settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    prevArrow: <SliderPrevArrow />,
    nextArrow: <SliderNextArrow />,
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: 10, width: "100%" }}>
        <ul className="custom-dots"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => <button aria-label={`Go to slide ${i + 1}`} />,
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="flex justify-center items-center h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="slider-wrapper relative">
        <Slider {...settings}>
          {movies.length > 0
            ? movies.map((movie) => (
                <div key={movie.id} className="focus:outline-none">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={movie.posterUrl || "/background.jpg"}
                      alt={`${movie.title}`}
                      className="h-[200px] sm:h-[300px] w-full object-cover md:h-[400px] lg:h-[500px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">
                        {movie.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/80">
                        Release Date:{" "}
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : // Fallback to placeholder images if no movies are available
              fallbackImages.map((img, index) => (
                <div key={index} className="focus:outline-none">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={img}
                      alt={`Slider Image ${index + 1}`}
                      className="h-[200px] sm:h-[300px] w-full object-cover md:h-[400px] lg:h-[500px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">
                        No Movie Data Available
                      </h3>
                      <p className="mt-2 text-sm text-white/80">
                        Please check back later
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </Slider>
      </div>
    </div>
  );
}

export default HomeSlider;
