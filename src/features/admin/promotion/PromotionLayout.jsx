import { Button, Card, Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  toggleFormVisibility,
  setFormMode,
} from "../../../redux/promotionSlice";
import PromotionTable from "./PromotionTable";
import PromotionDetail from "./PromotionDetail";
import PromotionForm from "./PromotionForm";

const { Title } = Typography;

function PromotionLayout() {
  const dispatch = useDispatch();

  const handleAddPromotion = () => {
    dispatch(setFormMode("create"));
    dispatch(toggleFormVisibility(true));
  };

  return (
    <div className="p-6">
      <Card>
        <Flex justify="space-between" align="center" className="mb-6">
          <Title level={4} style={{ margin: 0 }}>
            Promotion Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddPromotion}
          >
            Add Promotion
          </Button>
        </Flex>

        <PromotionTable />
        <PromotionDetail />
        <PromotionForm />
      </Card>
    </div>
  );
}

export default PromotionLayout;
