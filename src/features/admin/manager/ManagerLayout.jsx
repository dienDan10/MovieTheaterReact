import { useState } from "react";
import { Card, Typography, Space, Alert, Button } from "antd";
import { useGetManagers } from "./useGetManagers";
import ManagerTable from "./ManagerTable";
import ManagerForm from "./ManagerForm";

const { Title } = Typography;

function ManagerLayout() {
  const { error, refetch } = useGetManagers();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [formMode, setFormMode] = useState("create");

  const handleAddManager = () => {
    setSelectedManager(null);
    setFormMode("create");
    setFormModalOpen(true);
  };

  const handleEditManager = (manager) => {
    setSelectedManager(manager);
    setFormMode("edit");
    setFormModalOpen(true);
  };

  const handleFormClose = (refreshNeeded) => {
    setFormModalOpen(false);
    if (refreshNeeded) {
      // Data will be refreshed automatically via React Query invalidation
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>Manager Accounts</Title>

        {error && (
          <Alert
            message="Error"
            description={`Failed to load managers: ${
              error.message || "Unknown error"
            }`}
            type="error"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        )}

        <ManagerTable
          onAddManager={handleAddManager}
          onEditManager={handleEditManager}
        />

        <ManagerForm
          open={formModalOpen}
          onClose={handleFormClose}
          manager={selectedManager}
          mode={formMode}
        />
      </Space>
    </Card>
  );
}

export default ManagerLayout;
