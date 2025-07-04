import { Button, Card, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  toggleFormVisibility,
  setFormMode,
  clearSelectedEmployee,
} from "../../../redux/employeeSlice";
import EmployeeTable from "./EmployeeTable";
import EmployeeQuery from "./EmployeeQuery";
import EmployeeForm from "./EmployeeForm";

function EmployeeLayout() {
  const [_, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleAddEmployee = () => {
    dispatch(clearSelectedEmployee());
    dispatch(setFormMode("create"));
    dispatch(toggleFormVisibility(true));
  };

  return (
    <div className="container mx-auto px-4">
      {contextHolder}
      <Row className="mb-4">
        <Col span={24}>
          <Card
            title="Employee Management"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddEmployee}
              >
                Add Employee
              </Button>
            }
          >
            <EmployeeQuery />
            <EmployeeTable />
          </Card>
        </Col>
      </Row>
      <EmployeeForm />
    </div>
  );
}

export default EmployeeLayout;
