import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeSlider from "../../components/HomeSlider";
import MoviesGrid from "../../components/MoviesGrid";

function HomePageLayout() {
  const [activeCategory, setActiveCategory] = useState("current");

  return (
    <div className="relative bg-neutral-800 min-h-screen">
      <div className="flex items-center justify-center">
        <h2 className="uppercase inline-block border-b-2 py-2 pt-3 md:pt-5 font-semibold text-white">
          Popular Movies
        </h2>
      </div>

      <HomeSlider />

      <div className="mt-8 mb-8 flex items-center justify-center gap-3">
        <button
          className={`px-3 py-2 text-white font-semibold rounded-md hover:cursor-pointer transition-all ${
            activeCategory === "current"
              ? "bg-red-700 border-red-700"
              : "bg-transparent border-gray-100 hover:bg-red-700/20"
          }`}
          onClick={() => setActiveCategory("current")}
        >
          Currently Airing
        </button>
        <button
          className={`px-3 py-2 text-white font-semibold rounded-md hover:cursor-pointer transition-all ${
            activeCategory === "upcoming"
              ? "bg-red-700 border-red-700"
              : "bg-transparent border-gray-100 hover:bg-red-700/20"
          }`}
          onClick={() => setActiveCategory("upcoming")}
        >
          Coming Soon
        </button>
      </div>

      <MoviesGrid category={activeCategory} />
    </div>
  );
}

export default HomePageLayout;
