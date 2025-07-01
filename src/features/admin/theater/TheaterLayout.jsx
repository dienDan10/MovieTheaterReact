import { useState } from "react";
import { Card, Button, Typography, Space, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetTheaters } from "./useGetTheaters";
import TheaterTable from "./TheaterTable";
import TheaterDetail from "./TheaterDetail";
import TheaterForm from "./TheaterForm";
import { useSelector } from "react-redux";
import { ROLE_ADMIN } from "../../../utils/constant";
import AccessDenied from "../../../pages/AccessDenied";

const { Title } = Typography;

function TheaterLayout() {
  const { user } = useSelector((state) => state.user);
  const { error, refetch } = useGetTheaters();

  // Detail drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);

  // Form modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [editTheaterId, setEditTheaterId] = useState(null);

  // Handle viewing theater details
  const handleViewDetails = (theater) => {
    setSelectedTheaterId(theater.id);
    setDetailDrawerOpen(true);
  };

  // Handle creating a new theater
  const handleCreateTheater = () => {
    setFormMode("create");
    setEditTheaterId(null);
    setFormModalOpen(true);
  };

  // Handle editing a theater
  const handleEditTheater = (theater) => {
    setFormMode("edit");
    setEditTheaterId(theater.id);
    setFormModalOpen(true);
  };

  // Handle edit button in detail drawer
  const handleEditFromDetails = (theaterId) => {
    setDetailDrawerOpen(false); // Close the detail drawer
    setFormMode("edit");
    setEditTheaterId(theaterId);
    setFormModalOpen(true);
  };

  // Handle form modal close
  const handleFormClose = (refreshNeeded) => {
    setFormModalOpen(false);
    if (refreshNeeded) {
      // If we were editing and viewing the same theater, reopen the detail drawer
      if (formMode === "edit" && editTheaterId === selectedTheaterId) {
        setTimeout(() => setDetailDrawerOpen(true), 300);
      }
    }
  };

  if (user?.role !== ROLE_ADMIN) return <AccessDenied />;

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space
          direction="horizontal"
          justify="space-between"
          style={{ width: "100%" }}
        >
          <Title level={2}>Theaters</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateTheater}
          >
            Add Theater
          </Button>
        </Space>

        {error && (
          <Alert
            message="Error"
            description={`Failed to load theaters: ${
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

        <TheaterTable
          onViewDetails={handleViewDetails}
          onEditTheater={handleEditTheater}
        />

        {/* Theater details drawer */}
        <TheaterDetail
          open={detailDrawerOpen}
          onClose={() => setDetailDrawerOpen(false)}
          theaterId={selectedTheaterId}
          onEdit={handleEditFromDetails}
        />

        {/* Theater form modal */}
        <TheaterForm
          open={formModalOpen}
          onClose={handleFormClose}
          theaterId={editTheaterId}
          mode={formMode}
        />
      </Space>
    </Card>
  );
}

export default TheaterLayout;
