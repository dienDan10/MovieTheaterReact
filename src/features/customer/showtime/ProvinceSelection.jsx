import { Select } from "antd";
import { useState } from "react";

function ProvinceSelection() {
  const [selectedProvince, setSelectedProvince] = useState("hcm");

  // Sample data for provinces in Vietnam
  const provinces = [
    { value: "hcm", label: "Tp. Hồ Chí Minh" },
    { value: "hn", label: "Hà Nội" },
    { value: "dn", label: "Đà Nẵng" },
    { value: "ct", label: "Cần Thơ" },
    { value: "hp", label: "Hải Phòng" },
    { value: "nt", label: "Nha Trang" },
    { value: "dl", label: "Đà Lạt" },
  ];

  return (
    <div className="mb-6 px-5 py-4 bg-white rounded-lg">
      <Select
        value={selectedProvince}
        onChange={(value) => setSelectedProvince(value)}
        options={provinces}
        className="w-full"
        size="large"
        placeholder="Chọn tỉnh/thành phố"
      />
    </div>
  );
}

export default ProvinceSelection;
