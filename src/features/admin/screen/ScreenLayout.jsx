import { Button, Card, Row, Col, message, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFormVisibility,
  setFormMode,
  clearSelectedScreen,
  setSelectedTheaterId,
} from "../../../redux/screenSlice";
import ScreenTable from "./ScreenTable";
import ScreenSelection from "./ScreenSelection";
import ScreenForm from "./ScreenForm";
import { ROLE_ADMIN } from "../../../utils/constant";
import { useEffect } from "react";

const { Text } = Typography;

function ScreenLayout() {
  const { user } = useSelector((state) => state.user);
  const [_, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.theaterId)
      dispatch(setSelectedTheaterId(user.theaterId.toString()));
  }, [dispatch, user]);

  const handleAddScreen = () => {
    dispatch(clearSelectedScreen());
    dispatch(setFormMode("create"));
    dispatch(toggleFormVisibility(true));
  };

  return (
    <div className="container mx-auto px-4">
      {contextHolder}
      <Row className="mb-4">
        <Col span={24}>
          <Card
            title="Screen Management"
            extra={
              user?.role === ROLE_ADMIN && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddScreen}
                >
                  Add Screen
                </Button>
              )
            }
          >
            {user?.role === ROLE_ADMIN && <ScreenSelection />}
            <ScreenTable />
          </Card>
        </Col>
      </Row>
      <ScreenForm />
    </div>
  );
}

export default ScreenLayout;
