import { Spin, Typography } from "antd";
import RevenueFilter from "./RevenueFilter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ROLE_ADMIN, ROLE_MANAGER } from "../../../utils/constant";
import { setFilterTheaterId } from "../../../redux/revenueSlice";
import { useGetRevenue } from "./useGetRevenue";
import RevenueChart from "./RevenueChart";
import RevenueByMovie from "./RevenueByMovie";
import RevenueByConcession from "./RevenueByConcession";
import RevenueByTheater from "./RevenueByTheater";

const { Title } = Typography;

function RevenueLayout() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { revenue, isFetching, isError } = useGetRevenue();

  const revenueEmpty = revenue.length === 0;

  useEffect(() => {
    if (user && user.role == ROLE_MANAGER)
      dispatch(setFilterTheaterId(user.theaterId));
  }, [user, dispatch]);

  return (
    <div className="p-4">
      <Title level={3}>Thống kê doanh thu</Title>
      <RevenueFilter />
      {isFetching ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div className="p-6 text-center">
          <Title level={4} type="danger">
            Failed to load revenue data. Please try again later.
          </Title>
        </div>
      ) : revenueEmpty ? (
        <div className="p-6 text-center">
          <Title level={4}>
            No revenue data available for the selected date range.
          </Title>
        </div>
      ) : (
        <>
          <RevenueChart revenue={revenue} />
          <div className="flex flex-col xl:flex-row xl:gap-4 xl:mt-5">
            <RevenueByMovie revenue={revenue} />
            {user.role === ROLE_ADMIN && <RevenueByTheater revenue={revenue} />}
          </div>
          <RevenueByConcession revenue={revenue} />
        </>
      )}
    </div>
  );
}

export default RevenueLayout;
