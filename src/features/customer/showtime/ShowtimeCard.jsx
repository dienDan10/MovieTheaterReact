import Showtime from "./Showtime";

function ShowtimeCard() {
  return (
    <div className="bg-white rounded-lg p-4">
      <h4 className="font-semibold mb-2 text-red-600">Beta Trần Quang Khải</h4>
      <p className="text-sm text-gray-600 mb-4">
        Tầng 2 & 3, Toà nhà IMC, 62 Đường Trần Quang Khải, Phường Tân Định, Quận
        1, TP. Hồ Chí Minh
      </p>

      <div className="mb-4">
        <h5 className="font-medium mb-2">Showtimes</h5>
        <div className="flex flex-wrap gap-2">
          <Showtime isActive={false} time={"09:00"} price={""} />
          <Showtime isActive={false} time={"10:30"} price={""} />
          <Showtime isActive={false} time={"12:00"} price={""} />
          <Showtime isActive={false} time={"13:30"} price={""} />
          <Showtime isActive={true} time={"15:00"} price={"50K"} />
          <Showtime isActive={true} time={"16:30"} price={"50K"} />
          <Showtime isActive={true} time={"18:00"} price={"50K"} />
          <Showtime isActive={true} time={"19:30"} price={"50K"} />
          <Showtime isActive={true} time={"21:00"} price={"50K"} />
          <Showtime isActive={true} time={"22:30"} price={"50K"} />
        </div>
      </div>
    </div>
  );
}

export default ShowtimeCard;
