import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Button, Spin, Select, Space } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { useWatch } from "antd/es/form/Form";
import useCreateShowTime from "./useCreateShowTime";
import useUpdateShowTime from "./useUpdateShowTime";
import useGetShowTimeById from "./useGetShowTimeById";
import { useGetMovies } from "../../manager/movie/useGetMovies";
import useGetScreens from "./useGetScreens";
import useGetShowTimes from "./useGetShowTimes";
import dayjs from "dayjs";

function ShowTimeForm({ open, onClose, showTimeId, mode, movieId, screenId, date, theaterId, existingSlots = [] }) {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";
  const { data: showTime, isLoading } = useGetShowTimeById(showTimeId, isEdit && open);
  const createMutation = useCreateShowTime();
  const updateMutation = useUpdateShowTime();
  const [submitting, setSubmitting] = useState(false);
  // Lock fields if passed as props (KHAI BÁO TRƯỚC TIÊN)
  const isMovieLocked = !!movieId;
  const isScreenLocked = !!screenId;
  const isDateLocked = !!date;
  // Thêm state cho lockedSlots động
  const [dynamicLockedSlots, setDynamicLockedSlots] = useState([]);
  // Lấy danh sách phim và màn hình
  const { movies = [] } = useGetMovies();
  const { data: screensData } = useGetScreens(theaterId);
  const screens = useMemo(() => Array.isArray(screensData) ? screensData : (screensData?.data || []), [screensData]);
  // Locked slots: các slot đã có, không cho sửa/xóa
  const lockedSlots = useMemo(() => {
    if (!isMovieLocked && !isScreenLocked && !isDateLocked) return dynamicLockedSlots;
    return Array.isArray(existingSlots) ? existingSlots.map(slot => ({
      startTime: dayjs(slot.startTime, slot.startTime?.length > 5 ? 'HH:mm:ss' : 'HH:mm'),
      endTime: dayjs(slot.endTime, slot.endTime?.length > 5 ? 'HH:mm:ss' : 'HH:mm')
    })) : [];
  }, [dynamicLockedSlots, existingSlots, isMovieLocked, isScreenLocked, isDateLocked]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Tách slot đã có (không cho sửa/xóa) và slot mới
  const [timeSlots, setTimeSlots] = useState([{ startTime: null, endTime: null }]);
  // State cho inline editing
  // Theo dõi movieId, screenId, date động (chỉ khi không bị lock)
  const watchedMovieId = useWatch('movieId', form);
  const watchedScreenId = useWatch('screenId', form);
  const watchedDate = useWatch('date', form);
  const formMovieId = isMovieLocked ? movieId : watchedMovieId;
  const formScreenId = isScreenLocked ? screenId : watchedScreenId;
  const formDate = isDateLocked ? date : (watchedDate ? (typeof watchedDate === 'string' ? watchedDate : dayjs(watchedDate).format('YYYY-MM-DD')) : undefined);

  // Gọi API lấy showtime khi đã chọn đủ movie, screen, date (chỉ khi không bị lock)
  const shouldFetchDynamicSlots = !isMovieLocked && !isScreenLocked && !isDateLocked && formMovieId && formScreenId && formDate;
  const { data: dynamicShowTimes } = useGetShowTimes(
    formDate ? [dayjs(formDate), dayjs(formDate)] : undefined,
    formMovieId,
    formScreenId
  );
  useEffect(() => {
    if (shouldFetchDynamicSlots && dynamicShowTimes && Array.isArray(dynamicShowTimes.data)) {
      // Lấy các slot của movie/screen/date
      const slots = dynamicShowTimes.data.map(st => ({
        startTime: dayjs(st.startTime, st.startTime?.length > 5 ? 'HH:mm:ss' : 'HH:mm'),
        endTime: dayjs(st.endTime, st.endTime?.length > 5 ? 'HH:mm:ss' : 'HH:mm')
      }));
      setDynamicLockedSlots(slots);
    } else if (!shouldFetchDynamicSlots) {
      setDynamicLockedSlots([]);
    }
  }, [shouldFetchDynamicSlots, dynamicShowTimes]);

  useEffect(() => {
    if (showTime && isEdit) {
      const data = showTime.data || showTime;
      form.setFieldsValue({
        movieId: data.movieId,
        screenId: data.screenId,
        date: data.date ? dayjs(data.date) : null,
        ticketPrice: data.ticketPrice,
      });
      setSelectedMovie(movies.find(m => m.id === data.movieId));
      // Nếu là edit 1 slot, lấy đúng startTime và endTime của slot đang chọn
      if (data.startTime && data.endTime) {
        setTimeSlots([{
          startTime: dayjs(data.startTime, data.startTime.length > 5 ? 'HH:mm:ss' : 'HH:mm'),
          endTime: dayjs(data.endTime, data.endTime.length > 5 ? 'HH:mm:ss' : 'HH:mm'),
        }]);
      } else {
        // fallback: lấy theo kiểu cũ nếu có nhiều slot
        const slots = data.showTimes?.[0] || {};
        const startTimes = slots.startTimes || [];
        const endTimes = slots.endTimes || [];
        const newTimeSlots = startTimes.map((startTime, idx) => ({
          startTime: dayjs(startTime.ticks / 10000 - 621355968000000000),
          endTime: endTimes[idx] ? dayjs(endTimes[idx].ticks / 10000 - 621355968000000000) : null,
        }));
        setTimeSlots(newTimeSlots);
      }
    } else if (open && mode === "create") {
      // Set locked fields if provided
      if (movieId && movies.length > 0) {
        form.setFieldsValue({ movieId });
        setSelectedMovie(movies.find(m => m.id === movieId));
      }
      if (screenId && screens.length > 0) {
        form.setFieldsValue({ screenId });
      }
      if (date) {
        form.setFieldsValue({ date: dayjs(date) });
      }
    }
  }, [showTime, form, isEdit, movies, open, movieId, screenId, date, screens, mode]);

  useEffect(() => {
    if (open && !isEdit && !movieId) {
      form.resetFields();
      setSelectedMovie(null);
      setTimeSlots([{ startTime: null, endTime: null }]);
    }
  }, [open, form, isEdit, movieId]);

  // Khi edit: luôn đảm bảo timeSlots[0] có startTime/endTime từ showTime nếu chưa có (để Update hoạt động)
  useEffect(() => {
    if (isEdit && showTime && showTime.data && open) {
      console.log('[DEBUG] useEffect (edit mode): showTime', showTime, 'timeSlots', timeSlots, 'open', open);
      const data = showTime.data;
      if (!timeSlots[0].startTime && data.startTime) {
        setTimeSlots([
          {
            startTime: dayjs(data.startTime, data.startTime.length > 5 ? 'HH:mm:ss' : 'HH:mm'),
            endTime: dayjs(data.endTime, data.endTime.length > 5 ? 'HH:mm:ss' : 'HH:mm'),
          },
        ]);
      }
    }
    // eslint-disable-next-line
  }, [isEdit, showTime, open]);

  // Khi chọn movie thì lưu lại để kiểm tra duration
  const handleMovieChange = (value) => {
    const movie = movies.find(m => m.id === value);
    setSelectedMovie(movie);
    form.setFieldsValue({ movieId: value });
  };

  // Add/remove time slot handlers
  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: null, endTime: null }]);
  };
  const handleRemoveTimeSlot = (idx) => {
    const newSlots = timeSlots.filter((_, i) => i !== idx);
    setTimeSlots(newSlots.length === 0 ? [{ startTime: null, endTime: null }] : newSlots);
  };

  // Handle start time change and auto-calc end time
  const handleStartTimeChange = (idx, value) => {
    setTimeSlots(slots => {
      const newSlots = [...slots];
      newSlots[idx].startTime = value;
      if (selectedMovie && selectedMovie.duration && value) {
        newSlots[idx].endTime = value.clone().add(selectedMovie.duration, 'minute');
      } else {
        newSlots[idx].endTime = null;
      }
      return newSlots;
    });
  };

  // Validate slot gap (at least 10 minutes between slots)
  const [slotGapError, setSlotGapError] = useState("");
  // Validate if at least one slot is filled
  const [slotEmptyError, setSlotEmptyError] = useState("");
  useEffect(() => {
    if (isEdit) {
      setSlotGapError("");
      setSlotEmptyError("");
      return;
    }
    // Combine all slots for validation (locked + new)
    const allSlots = [
      ...lockedSlots.map((slot, idx) => ({ ...slot, _idx: `locked-${idx}`, locked: true })),
      ...timeSlots.map((slot, idx) => ({ ...slot, _idx: idx, locked: false }))
    ];
    // Only validate slot gap if all slots have startTime and endTime
    if (
      allSlots.length > 1 &&
      allSlots.every(slot => slot.startTime && slot.endTime)
    ) {
      const sortedSlots = [...allSlots].sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
      for (let i = 1; i < sortedSlots.length; i++) {
        const prev = sortedSlots[i - 1];
        const curr = sortedSlots[i];
        if (prev.endTime && curr.startTime && curr.startTime.diff(prev.endTime, 'minute') < 10) {
          setSlotGapError('Each slot must start at least 10 minutes after the previous slot ends.');
          // Remove slotGapErrorIdx logic, just continue
          setSlotEmptyError("");
          return;
        }
      }
    }
    setSlotGapError("");
    // Validate at least one slot has startTime and endTime (chỉ tính slot mới)
    if (!timeSlots.some(slot => slot.startTime && slot.endTime)) {
      setSlotEmptyError('Please add at least one valid showtime slot.');
    } else {
      setSlotEmptyError("");
    }
  }, [timeSlots, lockedSlots, isEdit]);

  // When movie changes, recalculate all endTimes
  useEffect(() => {
    if (selectedMovie && selectedMovie.duration) {
      setTimeSlots(slots => slots.map(slot => {
        if (slot.startTime) {
          return { ...slot, endTime: slot.startTime.clone().add(selectedMovie.duration, 'minute') };
        }
        return { ...slot, endTime: null };
      }));
    }
  }, [selectedMovie]);

  // Track form validation state
  // Removed unused setFormValid state
  // Track if user has interacted with the form
  const [formTouched, setFormTouched] = useState(false);
  useEffect(() => {
    if (!formTouched) return; // Only validate after user interaction
    const checkForm = async () => {
      try {
        await form.validateFields();
        // Check slot gap error
        // No setFormValid needed
      } catch {
        // No setFormValid needed
      }
    };
    checkForm();
  }, [form, timeSlots, slotGapError, formTouched]);

  // Reset formTouched về false khi mở form
  useEffect(() => {
    if (open) setFormTouched(false);
  }, [open]);

  // Mark form as touched on any change
  useEffect(() => {
    if (open) {
      const unsubscribe = form.subscribe?.(() => setFormTouched(true));
      return () => unsubscribe?.();
    }
  }, [form, open]);

  // Also validate on submit
  const handleSubmit = async () => {
    console.log('[DEBUG] handleSubmit called', { isEdit, timeSlots, formValues: form.getFieldsValue(), submitting });
    try {
      const values = await form.validateFields();
      if (slotGapError || slotEmptyError) {
        console.log('[DEBUG] Validation error', { slotGapError, slotEmptyError });
        return;
      }
      // Không validate conflict/gap khi edit nữa, chỉ validate ở create
      setSubmitting(true);
      if (isEdit) {
        const submitValues = {
          movieId: Number(values.movieId),
          screenId: Number(values.screenId),
          date: values.date ? values.date.format("YYYY-MM-DD") : null,
          ticketPrice: Number(values.ticketPrice),
          startTime: timeSlots[0]?.startTime ? timeSlots[0].startTime.format('HH:mm:ss') : null,
          endTime: timeSlots[0]?.endTime ? timeSlots[0].endTime.format('HH:mm:ss') : null,
        };
        console.log('[DEBUG] Submitting updateMutation', submitValues);
        updateMutation.mutate(
          { id: showTimeId, ...submitValues },
          {
            onSuccess: () => handleClose(true),
            onSettled: () => setSubmitting(false),
          }
        );
      } else {
        // Bulk create
        const showTimes = [
          {
            date: values.date.format("YYYY-MM-DD"),
            startTimes: timeSlots.map(slot => slot.startTime ? slot.startTime.format("HH:mm") : null),
            endTimes: timeSlots.map(slot => slot.endTime ? slot.endTime.format("HH:mm") : null),
          }
        ];
        createMutation.mutate({
          movieId: Number(values.movieId),
          screenId: Number(values.screenId),
          showTimes,
          ticketPrice: Number(values.ticketPrice),
        }, {
          onSuccess: () => handleClose(true),
          onSettled: () => setSubmitting(false),
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        // Chỉ hiển thị lỗi của Ant Design
        form.setFields([
          {
            name: 'date',
            errors: err.message.includes('date') ? [err.message] : [],
          },
          {
            name: 'movieId',
            errors: err.message.includes('movie') ? [err.message] : [],
          },
          {
            name: 'screenId',
            errors: err.message.includes('screen') ? [err.message] : [],
          },
          {
            name: 'ticketPrice',
            errors: err.message.includes('price') ? [err.message] : [],
          },
        ]);
      }
    }
  };

  const handleClose = (refresh = false) => {
    setSubmitting(false);
    form.resetFields();
    setSelectedMovie(null);
    setTimeSlots([{ startTime: null, endTime: null }]);
    onClose(refresh);
  };

  // Disable movie/screen/date if locked by props OR nếu slot mới đầu tiên (timeSlots[0]) đã có startTime (tức là user đã nhập slot mới)
  const hasNewSlotData = !isEdit && timeSlots.length > 0 && timeSlots[0].startTime;
  const isMovieFieldDisabled = isEdit || isMovieLocked || hasNewSlotData;
  const isScreenFieldDisabled = isEdit || isScreenLocked || hasNewSlotData;
  const isDateFieldDisabled = isEdit || isDateLocked || hasNewSlotData;

  if (isLoading) return <Spin />;

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Showtime" : "Create Showtime"}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Movie" name="movieId" rules={[{ required: true, message: 'Please select a movie.' }]}>
          <Select
            placeholder="Select a movie"
            onChange={handleMovieChange}
            disabled={isMovieFieldDisabled}
            options={movies.map(m => ({ label: m.title, value: m.id }))}
          />
        </Form.Item>
        <Form.Item label="Screen" name="screenId" rules={[{ required: true, message: 'Please select a screen.' }]}>
          <Select
            placeholder="Select a screen"
            disabled={isScreenFieldDisabled}
            options={screens.map(s => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date.' }]}>
          <DatePicker
            format="YYYY-MM-DD"
            disabled={isDateFieldDisabled}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Ticket Price" name="ticketPrice" rules={[{ required: true, message: 'Please enter a ticket price.' }]}>
          <InputNumber
            min={1}
            placeholder="Enter ticket price"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Showtime Slots" required>
          {/* Locked slots (không cho sửa/xóa) */}
          {/* Khi edit, không render lockedSlots, chỉ render đúng slot đang edit */}
          {isEdit ? (
            <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <TimePicker
                value={timeSlots[0]?.startTime}
                onChange={v => handleStartTimeChange(0, v)}
                format="HH:mm"
                placeholder="Start Time"
                style={{ width: 100 }}
              />
              <TimePicker
                value={timeSlots[0]?.endTime}
                format="HH:mm"
                placeholder="End Time"
                style={{ width: 100, background: '#f5f5f5' }}
                disabled
              />
            </Space>
          ) : (
            // ...existing code for create mode...
            <>
              {lockedSlots.map((slot, idx) => (
                <Space key={"locked-"+idx} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <TimePicker
                    value={slot.startTime}
                    format="HH:mm"
                    placeholder="Start Time"
                    style={{ width: 100, background: '#f5f5f5' }}
                    disabled
                  />
                  <TimePicker
                    value={slot.endTime}
                    format="HH:mm"
                    placeholder="End Time"
                    style={{ width: 100, background: '#f5f5f5' }}
                    disabled
                  />
                  <span style={{ color: '#888', fontSize: 12 }}>(Existing)</span>
                </Space>
              ))}
              {timeSlots.map((slot, idx) => (
                <Space key={idx} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <TimePicker
                    value={slot.startTime}
                    onChange={v => handleStartTimeChange(idx, v)}
                    format="HH:mm"
                    placeholder="Start Time"
                    style={{ width: 100 }}
                  />
                  <TimePicker
                    value={slot.endTime}
                    format="HH:mm"
                    placeholder="End Time"
                    style={{ width: 100, background: '#f5f5f5' }}
                    disabled
                  />
                  <Button danger onClick={() => handleRemoveTimeSlot(idx)} size="small">Remove</Button>
                </Space>
              ))}
            </>
          )}
          {/* Error/validation message */}
          {!isEdit && (slotGapError || slotEmptyError) && (
            <div style={{ color: 'red', marginTop: 8, fontWeight: 500 }}>{slotGapError || slotEmptyError}</div>
          )}
          {!isEdit && !slotGapError && !slotEmptyError && (
            <Button type="dashed" onClick={handleAddTimeSlot} block size="small">+ Add Slot</Button>
          )}
        </Form.Item>
        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => handleClose(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting} onClick={() => {
              console.log('[DEBUG] Update/Create button clicked', { isEdit, submitting });
            }}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

ShowTimeForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showTimeId: PropTypes.string,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  movieId: PropTypes.string,
  screenId: PropTypes.string,
  date: PropTypes.string,
  theaterId: PropTypes.string.isRequired,
  existingSlots: PropTypes.array,
};

export default ShowTimeForm;
