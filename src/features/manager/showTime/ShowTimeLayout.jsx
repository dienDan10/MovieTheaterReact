import { useState, useMemo } from "react";
import { Card, Button, Typography, Space, Drawer, DatePicker, Input, Row, Col, Image, Popconfirm, Alert } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ShowTimeForm from "./ShowTimeForm";
import ShowTimeDetail from "./ShowTimeDetail";
import useGetShowTimes from "./useGetShowTimes";
import { useGetMovies } from "../movie/useGetMovies";
import useDeleteShowTime from "./useDeleteShowTime";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function ShowTimeLayout() {
  // Detail drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedShowTimeId, setSelectedShowTimeId] = useState(null);

  // Form modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [editShowTimeId, setEditShowTimeId] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Filter/search state
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "day"),
    dayjs().add(7, "day"),
  ]);
  const [searchTitle, setSearchTitle] = useState("");

  // Pagination state
  const [page] = useState(1);
  const pageSize = 4; // Number of date groups per page

  // Lấy dữ liệu showtime thực tế
  const { data: showTimes = [] } = useGetShowTimes();
  // Lấy danh sách phim
  const { movies = [] } = useGetMovies();
  const deleteShowTimeMutation = useDeleteShowTime();

  const [hoveredSlotId, setHoveredSlotId] = useState(null);
  const [confirmingSlotId, setConfirmingSlotId] = useState(null);

  // Group showtimes theo ngày và movie (mapping movie info)
  const groupedShowTimes = useMemo(() => {
    const showTimeList = Array.isArray(showTimes.data) ? showTimes.data : [];
    if (showTimeList.length === 0) return [];
    const hasMovies = Array.isArray(movies) && movies.length > 0;
    // Defensive: ensure dateRange is always an array of 2 dayjs objects
    let start = dayjs().subtract(7, "day");
    let end = dayjs().add(7, "day");
    if (Array.isArray(dateRange) && dateRange.length === 2 && dayjs.isDayjs(dateRange[0]) && dayjs.isDayjs(dateRange[1])) {
      [start, end] = dateRange;
    }
    const filtered = showTimeList.filter((st) => {
      // Chuẩn hóa ngày và giờ
      const showDateTime = dayjs(`${st.date.split("T")[0]} ${st.startTime}`, "YYYY-MM-DD HH:mm:ss");
      const inRange =
        showDateTime.isSame(start) ||
        showDateTime.isSame(end) ||
        (showDateTime.isAfter(start) && showDateTime.isBefore(end));
      if (!hasMovies) return inRange;
      const movie = movies.find((m) => m.id === st.movieId);
      const matchTitle =
        searchTitle
          ? movie?.title?.toLowerCase().includes(searchTitle.toLowerCase())
          : true;
      return inRange && matchTitle;
    });
    // Group by date
    const byDate = {};
    filtered.forEach((st) => {
      const date = st.date.split("T")[0]; // chỉ lấy phần ngày
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(st);
    });
    // Group by movie in each date
    return Object.entries(byDate).map(([date, sts]) => {
      const movieMap = {};
      sts.forEach((st) => {
        const movieId = st.movieId;
        const movie = movies.find((m) => m.id === movieId);
        if (!movieMap[movieId]) {
          movieMap[movieId] = {
            movie: movie || { id: movieId, title: `Movie #${movieId}` },
            showtimes: [],
          };
        }
        movieMap[movieId].showtimes.push({
          id: st.id,
          startTime: st.startTime,
          endTime: st.endTime,
          ticketPrice: st.ticketPrice,
        });
      });
      return {
        date,
        movies: Object.values(movieMap),
      };
    });
  }, [showTimes, dateRange, searchTitle, movies]);

  // Calculate total showtime slots
  const totalShowTimes = groupedShowTimes.reduce((sum, group) => sum + group.movies.reduce((s, m) => s + (m.showtimes?.length || 0), 0), 0);
  // Paginate date groups
  const pagedGroups = groupedShowTimes.slice((page - 1) * pageSize, page * pageSize);


  // Handle creating a new showtime
  const handleCreateShowTime = () => {
    setFormMode("create");
    setEditShowTimeId(null);
    setSelectedMovieId(null);
    setFormModalOpen(true);
  };

  // Handle form modal close
  const handleFormClose = () => {
    setFormModalOpen(false);
    setFormMode("create");
  };

  // Filter/search handlers
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  const handleSearchTitleChange = (e) => {
    setSearchTitle(e.target.value);
  };


  // Handler thêm giờ chiếu cho từng phim
  const handleAddTime = (movieId) => {
    setFormMode("create");
    setEditShowTimeId(null);
    setSelectedMovieId(movieId);
    setFormModalOpen(true);
    // Có thể truyền movieId vào form nếu muốn
  };

  // Handler click vào slot suất chiếu
  const handleSlotClick = (showTimeId) => {
    setSelectedShowTimeId(showTimeId);
    setDetailDrawerOpen(true);
  };

  // Expose edit handler for ShowTimeDetail
  window.handleShowTimeEdit = (id) => {
    setFormMode("edit");
    setEditShowTimeId(id);
    setDetailDrawerOpen(false);
    setFormModalOpen(true);
  };

  // Handler for deleting showtime
  const handleDeleteShowTime = (showTimeId) => {
    deleteShowTimeMutation.mutate(showTimeId);
  };


  // --- UI ---
  return (
    <>
      <ShowTimeForm
        open={formModalOpen}
        onClose={handleFormClose}
        showTimeId={editShowTimeId}
        mode={formMode}
        movieId={selectedMovieId}
      />
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Title level={2}>Showtime Management</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateShowTime}
            >
              Add Showtime
            </Button>
          </Space>
          {/* Filter & Search Bar */}
          <Row
            gutter={[16, 16]}
            style={{
              marginBottom: 16,
              padding: "10px 18px",
              background: "#fafdff",
              borderRadius: 8,
              boxShadow: "0 1px 4px 0 #e0e0e0",
              alignItems: "center",
            }}
          >
            <Col xs={24} sm={24} md={8} lg={6} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 500, color: "#1c375b", marginBottom: 4 }}>
                Date Range
              </div>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
                classNames={{ popup: { root: "showtime-range-picker-popup" } }}
              />
            </Col>
            <Col xs={24} sm={24} md={8} lg={6} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 500, color: "#1c375b", marginBottom: 4 }}>
                Movie Title
              </div>
              <Input
                placeholder="Search by movie title"
                value={searchTitle}
                onChange={handleSearchTitleChange}
                allowClear
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
          {/* Grouped ShowTime Layout */}
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <Alert
                message={`Total showtimes: ${totalShowTimes}`}
                type="info"
                showIcon
                style={{ background: '#fafdff', border: '1px solid #e6f4ff' }}
              />
            </div>
            <div style={{
              maxHeight: 640, // Increased height for larger groupedShowTimes area
              minHeight: 400, // Ensure a minimum height for visual impact
              overflowY: 'auto',
              paddingRight: 16, // More padding for scroll
              background: '#fff',
              borderRadius: 12, // Slightly larger border radius
              border: '1.5px solid #e0e0e0', // Slightly bolder border
              marginBottom: 16,
              boxShadow: '0 4px 24px 0 #e6f7ff', // Subtle shadow for emphasis
              transition: 'max-height 0.3s, min-height 0.3s',
            }}>
              {pagedGroups.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', fontSize: 18, padding: 40 }}>
                  No showtimes in this date range.<br/>
                </div>
              )}
              {pagedGroups?.map((dateGroup) => (
                <Card key={dateGroup.date} style={{ marginBottom: 24 }}>
                  {/* ShowTimeDateGroup inline */}
                  <div>
                    <Title level={5}>
                      {dayjs(dateGroup.date).format('dddd, MMMM D, YYYY')}
                    </Title>
                    {dateGroup.movies?.map((movieGroup) => (
                      // ShowTimeMovieGroup inline
                      <Card key={movieGroup.movie.id} style={{ marginBottom: 8 }}>
                        <Space align="start">
                          <Image
                            src={movieGroup.movie.posterUrl && movieGroup.movie.posterUrl.trim() ? movieGroup.movie.posterUrl : undefined}
                            width={80}
                            height={120}
                            alt={movieGroup.movie.title}
                            fallback="/images/default-movie.png"
                            style={{ objectFit: 'cover', borderRadius: 4, background: '#f5f5f5' }}
                            preview={false}
                            placeholder={
                              <div style={{width:80,height:120,display:'flex',alignItems:'center',justifyContent:'center',color:'#bbb',fontSize:14,fontStyle:'italic',background:'#f0f0f0'}}>No Poster</div>
                            }
                          />
                          <div>
                            <Title level={5}>{movieGroup.movie.title || `Movie #${movieGroup.movie.id}`}</Title>
                            <Text>
                              Director: {movieGroup.movie.director || 'N/A'}
                            </Text>
                            <br />
                            <Text>
                              Duration: {movieGroup.movie.duration ? `${movieGroup.movie.duration} minutes` : 'N/A'}
                            </Text>
                            <br />
                            <Text>
                              Description: {movieGroup.movie.description || 'N/A'}
                            </Text>
                          </div>
                        </Space>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 16,
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            paddingBottom: 4,
                            scrollbarWidth: "thin",
                            scrollbarColor: "#d9d9d9 #f5f5f5"
                          }}
                        >
                          <Space style={{ minWidth: 0 }}>
                            {movieGroup.showtimes?.map((slot) => (
                              <div
                                key={slot.id}
                                style={{ display: 'inline-block', marginRight: 8, marginBottom: 8, position: 'relative' }}
                                onMouseEnter={() => setHoveredSlotId(slot.id)}
                                onMouseLeave={() => { if (confirmingSlotId !== slot.id) setHoveredSlotId(null); }}
                              >
                                <Button
                                  type="primary"
                                  shape="round"
                                  onClick={() => handleSlotClick(slot.id)}
                                  style={{ marginRight: 0, marginBottom: 2 }}
                                >
                                  <div style={{ textAlign: 'center', fontWeight: 500 }}>
                                    {dayjs(slot.startTime, 'HH:mm:ss').format('HH:mm')} - {dayjs(slot.endTime, 'HH:mm:ss').format('HH:mm')}
                                  </div>
                                  <div style={{ textAlign: 'center', color: '#fa8c16', fontWeight: 700, fontSize: 15 }}>
                                    {slot.ticketPrice >= 1000 ? `${Math.round(slot.ticketPrice / 1000)}k` : slot.ticketPrice}
                                  </div>
                                </Button>
                                {(hoveredSlotId === slot.id || confirmingSlotId === slot.id) && (
                                  <Popconfirm
                                    title="Are you sure to delete this showtime?"
                                    onConfirm={() => { handleDeleteShowTime(slot.id); setConfirmingSlotId(null); setHoveredSlotId(null); }}
                                    onCancel={() => setConfirmingSlotId(null)}
                                    okText="Yes"
                                    cancelText="No"
                                    open={confirmingSlotId === slot.id}
                                    onOpenChange={(visible) => {
                                      if (visible) setConfirmingSlotId(slot.id);
                                      else setConfirmingSlotId(null);
                                    }}
                                  >
                                    <DeleteOutlined
                                      style={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        fontSize: 18,
                                        color: '#ff4d4f',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        padding: 2,
                                        boxShadow: '0 1px 4px #ccc',
                                        cursor: 'pointer',
                                        zIndex: 2
                                      }}
                                      onClick={e => { e.stopPropagation(); setConfirmingSlotId(slot.id); }}
                                    />
                                  </Popconfirm>
                                )}
                              </div>
                            ))}
                          </Space>
                        </div>
                        <div
                          style={{
                            marginTop: 16,
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Button
                            type="primary"
                            style={{
                              background: "#52c41a",
                              borderColor: "#52c41a",
                              color: "#fff",
                              fontWeight: 600,
                              boxShadow: "0 2px 8px #b7eb8f",
                            }}
                            onClick={() => handleAddTime(movieGroup.movie.id)}
                          >
                            + Add Showtime
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
          {/* chi tiết suất chiếu */}
          <ShowTimeDetail
            open={detailDrawerOpen}
            onClose={() => setDetailDrawerOpen(false)}
            showTimeId={selectedShowTimeId}
          />
        </Space>
      </Card>
    </>
  );
}

export default ShowTimeLayout;
