import { Card, Row, Col, message } from "antd";
import CustomerTable from "./CustomerTable";
import CustomerQuery from "./CustomerQuery";

function CustomerLayout() {
  const [_, contextHolder] = message.useMessage();

  return (
    <div className="container mx-auto px-4">
      {contextHolder}
      <Row className="mb-4">
        <Col span={24}>
          <Card title="Customer Management">
            <CustomerQuery />
            <CustomerTable />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CustomerLayout;
