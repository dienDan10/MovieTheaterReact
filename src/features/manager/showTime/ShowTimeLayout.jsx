import { useState, useMemo, useEffect } from "react";
import { Card, Button, Typography, Space, Drawer, DatePicker, Input, Row, Col, Image, Popconfirm, Alert } from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ShowTimeForm from "./ShowTimeForm";
import ShowTimeDetail from "./ShowTimeDetail";
import useGetShowTimes from "./useGetShowTimes";
import { useGetMovies } from "../movie/useGetMovies";
import useDeleteShowTime from "./useDeleteShowTime";
import { useSelector } from "react-redux";
import useGetScreens from "./useGetScreens";

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
  const [dateRange, setDateRange] = useState();
  const [searchTitle, setSearchTitle] = useState("");
  const [screenFilter, setScreenFilter] = useState();
  const [pendingDateRange, setPendingDateRange] = useState();
  const [pendingSearchTitle, setPendingSearchTitle] = useState("");
  const [pendingScreenFilter, setPendingScreenFilter] = useState();

  // Lấy dữ liệu showtime thực tế
  const { data: showTimes = [] } = useGetShowTimes(dateRange, undefined, screenFilter);
  // Lấy danh sách phim
  const { movies = [] } = useGetMovies();
  const deleteShowTimeMutation = useDeleteShowTime();

  const [hoveredSlotId, setHoveredSlotId] = useState(null);
  const [confirmingSlotId, setConfirmingSlotId] = useState(null);

  // Get manager's theaterId from Redux
  const theaterId = useSelector(state => state.user.user.theaterId);
  // Fetch screens for this theater
  const { data: screensData } = useGetScreens(theaterId);
  // Memoize screens to avoid useEffect dependency warning
  const screens = useMemo(() => Array.isArray(screensData) ? screensData : (screensData?.data || []), [screensData]);

  // Set default screen filter to first screen in list
  useEffect(() => {
    if (screens.length > 0 && !pendingScreenFilter) {
      setPendingScreenFilter(String(screens[0].id));
      setScreenFilter(String(screens[0].id));
    }
  }, [screens, pendingScreenFilter]);

  // Group showtimes theo ngày và movie (mapping movie info)
  const groupedShowTimes = useMemo(() => {
    const showTimeList = Array.isArray(showTimes.data) ? showTimes.data : [];
    if (showTimeList.length === 0) return [];
    const hasMovies = Array.isArray(movies) && movies.length > 0;
    // Filter showtimes by screen if filter is set
    const filtered = showTimeList.filter((st) => {
      if (!hasMovies) return true;
      const movie = movies.find((m) => m.id === st.movieId);
      const matchTitle =
        searchTitle
          ? movie?.title?.toLowerCase().includes(searchTitle.toLowerCase())
          : true;
      const matchScreen = screenFilter ? String(st.screenId) === String(screenFilter) : true;
      return matchTitle && matchScreen;
    });
    // Group by date
    const byDate = {};
    filtered.forEach((st) => {
      const date = st.date.split("T")[0]; // only date part
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
  }, [showTimes, searchTitle, movies, screenFilter]);

  // Calculate total showtime slots
  const totalShowTimes = groupedShowTimes.reduce((sum, group) => sum + group.movies.reduce((s, m) => s + (m.showtimes?.length || 0), 0), 0);
  // No pagination: show all date groups
  const pagedGroups = groupedShowTimes;


  // Handle creating a new showtime (nút ở cạnh title)
  const handleCreateShowTime = () => {
    setFormMode("create");
    setEditShowTimeId(null);
    setSelectedMovieId(null);
    setFormModalOpen(true);
    setSelectedShowTimeDate(undefined);
    setSelectedExistingSlots([]);
  };

  // Handle form modal close
  const handleFormClose = () => {
    setFormModalOpen(false);
    setFormMode("create");
    setSelectedShowTimeDate(undefined);
  };

  // Filter/search handlers
  const handleDateRangeChange = (range) => {
    setPendingDateRange(range);
  };
  const handleSearchTitleChange = (e) => {
    setPendingSearchTitle(e.target.value);
  };
  const handleApplyFilter = () => {
    setDateRange(pendingDateRange);
    setSearchTitle(pendingSearchTitle);
    setScreenFilter(pendingScreenFilter || (screens[0] && String(screens[0].id)));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setPendingDateRange(undefined);
    setPendingSearchTitle("");
    setPendingScreenFilter(screens[0] ? String(screens[0].id) : "");
    setDateRange(undefined);
    setSearchTitle("");
    setScreenFilter(screens[0] ? String(screens[0].id) : "");
  };


  // Handler thêm giờ chiếu cho từng phim, truyền movieId, screenId, date
  const handleAddTime = (movieId, date) => {
    setFormMode("create");
    setEditShowTimeId(null);
    setSelectedMovieId(movieId);
    setFormModalOpen(true);
    setSelectedShowTimeDate(date); // new state for selected date
    // Lấy các slot đã có của movie, screen, date
    const slots = [];
    const showTimeList = Array.isArray(showTimes.data) ? showTimes.data : [];
    showTimeList.forEach(st => {
      if (
        st.movieId === movieId &&
        String(st.screenId) === String(screenFilter) &&
        st.date.split("T")[0] === date
      ) {
        slots.push({
          startTime: st.startTime,
          endTime: st.endTime
        });
      }
    });
    setSelectedExistingSlots(slots);
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

  // Add state for selectedShowTimeDate
  const [selectedShowTimeDate, setSelectedShowTimeDate] = useState();
  // Add state for existingSlots
  const [selectedExistingSlots, setSelectedExistingSlots] = useState([]);


  // --- UI ---
  return (
    <>
      <ShowTimeForm
        open={formModalOpen}
        onClose={handleFormClose}
        showTimeId={editShowTimeId}
        mode={formMode}
        movieId={selectedMovieId}
        screenId={selectedMovieId ? screenFilter : undefined} // Nếu là nút nhỏ thì lock screen, nút to thì cho chọn
        date={selectedShowTimeDate || (dateRange && dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : undefined)}
        theaterId={theaterId}
        existingSlots={selectedExistingSlots}
      />
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Title level={2}>Showtime</Title>
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
                value={pendingDateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
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
                value={pendingSearchTitle}
                onChange={handleSearchTitleChange}
                allowClear
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} sm={24} md={8} lg={6} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 500, color: "#1c375b", marginBottom: 4 }}>
                Screen
              </div>
              <select
                value={pendingScreenFilter || (screens[0] && String(screens[0].id)) || ''}
                onChange={e => setPendingScreenFilter(e.target.value)}
                style={{ width: "100%", height: 32, borderRadius: 4, border: '1px solid #d9d9d9', paddingLeft: 8 }}
              >
                {/* No 'All Screens' option */}
                {screens.map(screen => (
                  <option key={screen.id} value={screen.id}>{screen.name}</option>
                ))}
              </select>
            </Col>
            <Col xs={24} sm={24} md={8} lg={6} style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                onClick={handleApplyFilter}
                size="middle"
                icon={<FilterOutlined />} // Add filter icon
                style={{ width:"50%", marginLeft: 8 }}
              >
                Apply
              </Button>
              <Button
                onClick={handleResetFilters}
                size="middle"
                icon={<ReloadOutlined />} // Add reset icon
                style={{ width: "50%", marginTop: 8, marginLeft: 8 }}
              >
                Reset
              </Button>
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
                      <Card key={movieGroup.movie.id} style={{ marginBottom: 8 }}>
                        <Row gutter={24}>
                          <Col xs={24} md={10}>
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
                                <Text>Director: {movieGroup.movie.director || 'N/A'}</Text>
                                <br />
                                <Text>Duration: {movieGroup.movie.duration ? `${movieGroup.movie.duration} minutes` : 'N/A'}</Text>
                                <br />
                                <Text>Description: {movieGroup.movie.description || 'N/A'}</Text>
                              </div>
                            </Space>
                          </Col>
                          <Col xs={24} md={14}>
                            {/* Slot times row */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 8,
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
                            {/* Add Showtime button row */}
                            <div style={{ marginTop: 12, textAlign: 'left' }}>
                              <Button
                                type="primary"
                                style={{
                                  background: "#52c41a",
                                  borderColor: "#52c41a",
                                  color: "#fff",
                                  fontWeight: 600,
                                  boxShadow: "0 2px 8px #b7eb8f",
                                  minWidth: 140
                                }}
                                onClick={() => handleAddTime(movieGroup.movie.id, dateGroup.date)}
                              >
                                + Add Showtime
                              </Button>
                            </div>
                          </Col>
                        </Row>
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
