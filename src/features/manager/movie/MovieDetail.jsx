import { Descriptions, Spin } from "antd";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../../../services/apiMovie";


function MovieDetail({ movieId}) {
  const {
    data,
    isPending,
    isFetching,
    error,
    previousData,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      if (!movieId) return null;
      const res = await getMovieById(movieId);
      return res.data;
    },
    enabled: !!movieId,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // giữ cache 5 phút
  });
  // Ưu tiên hiển thị previousData nếu đang fetching
  const movie = isFetching && previousData ? previousData : data;

  return (
    
      <Spin spinning={isPending}>
        {isPending && !movie ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            Loading movie details...
          </div>
        ) : movie ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">{movie.title}</Descriptions.Item>
            <Descriptions.Item label="Genre">{movie.genre}</Descriptions.Item>
            {movie.year && <Descriptions.Item label="Year">{movie.year}</Descriptions.Item>}
            <Descriptions.Item label="Description">
              {movie.description}
            </Descriptions.Item>
            {movie.poster && (
              <Descriptions.Item label="Poster">
                <img
                  src={movie.poster}
                  alt="Poster"
                  style={{ width: 120 }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>Failed to load movie details.</div>
        ) : null}
      </Spin>
  );
}

MovieDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onEdit: PropTypes.func.isRequired,
};

export default MovieDetail;
