import React, { useEffect } from "react";
import { Form, Select, Card, Spin } from "antd";
import { useGetTheaters } from "./useGetTheaters";
import { useGetScreens } from "./useGetScreens";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTheaterId,
  setSelectedScreenId,
} from "../../../redux/seatSlice";
import { ROLE_MANAGER } from "../../../utils/constant";

const SeatSelection = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { selectedTheaterId } = useSelector((state) => state.seat);

  const isManager = user?.role === ROLE_MANAGER;
  const managedTheaterId = user?.theaterId;

  const { theaters, isLoading: isLoadingTheaters } = useGetTheaters();
  const { screens, isLoading: isLoadingScreens } =
    useGetScreens(selectedTheaterId);

  useEffect(() => {
    // If user is a manager, auto-select their theater
    if (isManager && managedTheaterId) {
      dispatch(setSelectedTheaterId(managedTheaterId));
      form.setFieldsValue({ theaterId: managedTheaterId });
    }
  }, [isManager, managedTheaterId, dispatch, form]);

  const handleTheaterChange = (theaterId) => {
    dispatch(setSelectedTheaterId(theaterId));
    // Reset screen selection when theater changes
    form.setFieldsValue({ screenId: undefined });
  };

  const handleScreenChange = (screenId) => {
    dispatch(setSelectedScreenId(screenId));
  };

  return (
    <Card title="Select Theater and Screen" size="small">
      <Form
        form={form}
        layout="vertical"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Form.Item
          name="theaterId"
          label="Theater"
          rules={[{ required: true, message: "Please select theater" }]}
        >
          <Select
            placeholder="Select theater"
            options={theaters}
            onChange={handleTheaterChange}
            loading={isLoadingTheaters}
            disabled={isManager} // Disabled for managers as they have a fixed theater
          />
        </Form.Item>

        <Form.Item
          name="screenId"
          label="Screen"
          rules={[{ required: true, message: "Please select screen" }]}
        >
          <Select
            placeholder={
              selectedTheaterId
                ? "Select screen"
                : "Please select theater first"
            }
            options={screens}
            onChange={handleScreenChange}
            loading={isLoadingScreens}
            disabled={!selectedTheaterId}
          />
        </Form.Item>
      </Form>

      {(isLoadingTheaters || isLoadingScreens) && (
        <div className="flex justify-center">
          <Spin />
        </div>
      )}
    </Card>
  );
};

export default SeatSelection;
