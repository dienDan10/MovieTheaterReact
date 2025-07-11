import { Button, Card, Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  toggleFormVisibility,
  setFormMode,
} from "../../../redux/concessionSlice";
import ConcessionTable from "./ConcessionTable";
import ConcessionDetail from "./ConcessionDetail";
import ConcessionForm from "./ConcessionForm";

const { Title } = Typography;

function ConcessionLayout() {
  const dispatch = useDispatch();

  const handleAddConcession = () => {
    dispatch(setFormMode("create"));
    dispatch(toggleFormVisibility(true));
  };

  return (
    <div className="p-6">
      <Card>
        <Flex justify="space-between" align="center" className="mb-6">
          <Title level={4} style={{ margin: 0 }}>
            Concession Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddConcession}
          >
            Add Concession
          </Button>
        </Flex>

        <ConcessionTable />
        <ConcessionDetail />
        <ConcessionForm />
      </Card>
    </div>
  );
}

export default ConcessionLayout;
