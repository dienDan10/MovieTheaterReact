import { Drawer, Descriptions, Spin, Alert, Image, Button } from "antd";
import PropTypes from "prop-types";
import useGetShowTimeById from "./useGetShowTimeById";
import { useGetMovies } from "../movie/useGetMovies";
import useGetScreens from "./useGetScreens";

function ShowTimeDetail({ open, onClose, showTimeId }) {
  const { data: showTime, isLoading, error } = useGetShowTimeById(showTimeId, open);
  const { movies = [] } = useGetMovies();
  const { data: screensData } = useGetScreens();
  const screens = Array.isArray(screensData) ? screensData : (screensData?.data || []);

  // Lấy movie và screen theo id
  const movie = movies.find(m => m.id === showTime?.data?.movieId);
  const screen = screens.find(s => s.id === showTime?.data?.screenId);

  return (
    <Drawer title={`ShowTime Detail (ID: ${showTimeId})`} open={open} onClose={onClose} width={480}>
      <Spin spinning={isLoading}>
        {error && (
          <Alert type="error" message={`Loading show time error: ${error.message}`} showIcon style={{ marginBottom: 16 }} />
        )}
        {showTime && showTime.data ? (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="ID">{showTime.data.id}</Descriptions.Item>
              <Descriptions.Item label="Movie">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 60, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                    {movie?.posterUrl && movie.posterUrl.trim() ? (
                      <Image
                        src={movie.posterUrl}
                        width={60}
                        height={90}
                        alt={movie.title}
                        fallback="/images/default-movie.png"
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                        preview={false}
                      />
                    ) : (
                      <div style={{ width: 60, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 12, fontStyle: 'italic', background: '#f0f0f0' }}>
                        No Poster
                      </div>
                    )}
                  </div>
                  <span>{movie?.title || `Movie #${showTime.data.movieId}`}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Screen">{screen ? screen.name : `Screen #${showTime.data.screenId}`}</Descriptions.Item>
              <Descriptions.Item label="Start Time">{showTime.data.startTime}</Descriptions.Item>
              <Descriptions.Item label="End Time">{showTime.data.endTime}</Descriptions.Item>
              <Descriptions.Item label="Price">{showTime.data.ticketPrice}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Button type="primary" onClick={() => {
                onClose();
                setTimeout(() => {
                  if (typeof window.handleShowTimeEdit === 'function') {
                    window.handleShowTimeEdit(showTime.data.id);
                  }
                }, 300);
              }}>
                Edit Showtime
              </Button>
            </div>
          </>
        ) : !isLoading ? (
          <div style={{ color: "#888", textAlign: "center", padding: 32 }}>
            Không tìm thấy thông tin suất chiếu với ID: <b>{String(showTimeId)}</b>
          </div>
        ) : null}
      </Spin>
    </Drawer>
  );
}

ShowTimeDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showTimeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ShowTimeDetail;
