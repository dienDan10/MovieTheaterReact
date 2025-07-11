import { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { useDispatch } from "react-redux";
import { setProvinceId } from "../../../redux/showtimeSlice";
import useGetProvinces from "./useGetProvinces";

function ProvinceSelection() {
  const dispatch = useDispatch();
  const { data: provincesResponse, isLoading } = useGetProvinces();
  const [selectedProvince, setSelectedProvince] = useState(1); // default to the first province with id = 1

  // Set default province once data is loaded
  useEffect(() => {
    if (provincesResponse?.data && provincesResponse.data.length > 0) {
      // Use the first province as default if available
      const defaultProvince = provincesResponse.data[0]?.id || 1;
      setSelectedProvince(defaultProvince);
      dispatch(setProvinceId(defaultProvince));
    }
  }, [provincesResponse, dispatch]);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    dispatch(setProvinceId(value));
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg">
      <label className="block text-gray-700 mb-2">Chọn tỉnh/thành phố:</label>
      {isLoading ? (
        <div className="flex items-center">
          <Spin size="small" className="mr-2" /> Đang tải...
        </div>
      ) : (
        <Select
          value={selectedProvince}
          onChange={handleProvinceChange}
          style={{ width: "100%" }}
          options={
            provincesResponse?.data?.map((province) => ({
              value: province.id,
              label: province.name,
            })) || []
          }
          placeholder="Chọn tỉnh/thành phố"
          className="w-full"
        />
      )}
    </div>
  );
}

export default ProvinceSelection;
