import { Input, Modal } from "antd";
import { useEffect, useState } from "react";
import ConcessionRevenueItem from "./ConcessionRevenueItem";

function RevenueByConcessionModal({ concessionStats, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConcessions, setFilteredConcessions] = useState([]);

  // Update filtered movies whenever search term or concessionStats changes
  useEffect(() => {
    if (!concessionStats) {
      setFilteredConcessions([]);
      return;
    }

    const filtered = concessionStats.filter((concession) =>
      concession.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConcessions(filtered);
  }, [searchTerm, concessionStats]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Modal
      title="Doanh thu theo combo bỏng nước"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên combo"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {filteredConcessions.length > 0 ? (
          filteredConcessions.map((concession) => (
            <ConcessionRevenueItem
              key={concession.id}
              concession={concession}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            {searchTerm ? "Không tìm thấy combo nào" : "Không có dữ liệu"}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default RevenueByConcessionModal;
