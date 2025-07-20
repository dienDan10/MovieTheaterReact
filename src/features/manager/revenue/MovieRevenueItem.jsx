function MovieRevenueItem({ movie }) {
  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
      <div className="flex-1/3">
        <p>Phim</p>
        <p className="uppercase font-semibold">{movie.title}</p>
      </div>
      <div className="flex-1/3 flex flex-col items-center">
        <p>Vé bán ra</p>
        <p className="uppercase font-semibold">{movie.ticketCount}</p>
      </div>
      <div className="flex-1/3 flex flex-col items-center">
        <p>Tổng tiền</p>
        <p className="uppercase font-semibold">
          {movie.revenue.toLocaleString("vi-VN")} đ
        </p>
      </div>
    </div>
  );
}

export default MovieRevenueItem;
