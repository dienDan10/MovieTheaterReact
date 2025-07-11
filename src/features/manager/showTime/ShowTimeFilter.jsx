import React, { useEffect } from "react";
import { Button, DatePicker, Form, Select, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  resetFilters,
  setFilterEndDate,
  setFilterMovieId,
  setFilterScreenId,
  setFilterStartDate,
  setLoading,
} from "../../../redux/manageShowtimeSlice";
import useGetScreens from "./useGetScreens";
import useGetMovies from "./useGetMovies";
import useGetShowTimes from "./useGetShowTimes";

const ShowTimeFilter = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.manageShowtime.filters);
  const { data: screens, isLoading: isLoadingScreens } = useGetScreens();
  const { data: movies, isLoading: isLoadingMovies } = useGetMovies();
  const { refetch, isFetching } = useGetShowTimes();

  // Set initial values
  useEffect(() => {
    form.setFieldsValue({
      dateRange: [dayjs(filters.startDate), dayjs(filters.endDate)],
      movieId: filters.movieId,
      screenId: filters.screenId,
    });
  }, [form, filters]);

  // Refetch when filters change
  useEffect(() => {
    dispatch(setLoading({ key: "filter", value: isFetching }));
  }, [isFetching, dispatch]);

  // Handle form submission
  const onFinish = (values) => {
    const [startDate, endDate] = values.dateRange || [null, null];

    if (startDate) {
      dispatch(setFilterStartDate(startDate.format("YYYY-MM-DD")));
    }

    if (endDate) {
      dispatch(setFilterEndDate(endDate.format("YYYY-MM-DD")));
    }

    dispatch(setFilterMovieId(values.movieId));
    dispatch(setFilterScreenId(values.screenId));

    refetch();
  };

  // Handle reset
  const handleReset = () => {
    form.resetFields();
    dispatch(resetFilters());
    refetch();
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-6">
      <Form
        form={form}
        name="showTimeFilter"
        layout="vertical"
        onFinish={onFinish}
        className="md:flex md:flex-wrap md:items-end md:gap-4"
      >
        {/* Date Range */}
        <Form.Item
          label="Date Range"
          name="dateRange"
          className="md:flex-1 mb-2 md:mb-0"
        >
          <DatePicker.RangePicker
            className="w-full"
            format="YYYY-MM-DD"
            allowClear={false}
          />
        </Form.Item>

        {/* Movie */}
        <Form.Item
          label="Movie"
          name="movieId"
          className="md:w-64 mb-2 md:mb-0"
        >
          <Select
            placeholder="Select Movie"
            allowClear
            showSearch
            loading={isLoadingMovies}
            options={movies?.movies.map((movie) => ({
              label: movie.title,
              value: movie.id,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="label"
          />
        </Form.Item>

        {/* Screen */}
        <Form.Item
          label="Screen"
          name="screenId"
          className="md:w-48 mb-4 md:mb-0"
        >
          <Select
            placeholder="Select Screen"
            allowClear
            loading={isLoadingScreens}
            options={screens?.map((screen) => ({
              label: screen.name,
              value: screen.id,
            }))}
          />
        </Form.Item>

        {/* Buttons */}
        <Form.Item className="md:ml-auto mb-0">
          <Space>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={isFetching}
            >
              Apply
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShowTimeFilter;
