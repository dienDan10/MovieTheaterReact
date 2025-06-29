import Slider from "react-slick";
import SliderNextArrow from "./SliderNextArrow";
import SliderPrevArrow from "./SliderPrevArrow";

function HomeSlider() {
  const images = [
    "/background.jpg",
    "/vite.svg",
    "/images/slider1.jpg",
    "/images/slider2.jpg",
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

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="slider-wrapper relative">
        {/* Removed margin-bottom as dots are inside the slider now */}
        <Slider {...settings}>
          {images.map((img, index) => (
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
                    Movie Title {index + 1}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Release Date: 2025
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
