import { Input, Modal } from "antd";
import { useEffect, useState } from "react";
import TheaterRevenueItem from "./TheaterRevenueItem";

function RevenueByTheaterModal({ theaterStats, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTheaters, setfilteredTheaters] = useState([]);

  // Update filtered movies whenever search term or theaterStats changes
  useEffect(() => {
    if (!theaterStats) {
      setfilteredTheaters([]);
      return;
    }

    const filtered = theaterStats.filter((theater) =>
      theater.theaterName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setfilteredTheaters(filtered);
  }, [searchTerm, theaterStats]);

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
        {filteredTheaters.length > 0 ? (
          filteredTheaters.map((theater) => (
            <TheaterRevenueItem key={theater.theaterId} theater={theater} />
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

export default RevenueByTheaterModal;
