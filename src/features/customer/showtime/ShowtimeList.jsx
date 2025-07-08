import DateSelection from "./DateSelection";
import ProvinceSelection from "./ProvinceSelection";
import Showtime from "./Showtime";
import ShowtimeCard from "./ShowtimeCard";

function ShowtimeList() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* <!-- Header --> */}
      <h1 className="text-2xl font-semibold text-center mb-6">Lịch chiếu</h1>

      {/* <!-- Location and Format Selection --> */}
      <ProvinceSelection />

      {/* <!-- Date Selection --> */}
      <DateSelection />

      {/* <!-- Cinema Listings --> */}
      <div className="space-y-6">
        {/* <!-- Beta Trần Quang Khải --> */}
        <ShowtimeCard />
      </div>
    </div>
  );
}

export default ShowtimeList;
