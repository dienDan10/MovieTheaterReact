import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { IoIosNotifications } from "react-icons/io";
import {
  MdAccountCircle,
  MdFeedback,
  MdReport,
  MdSpaceDashboard,
} from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_MANAGER } from "../../utils/constant";

// eslint-disable-next-line react/prop-types
function ControlPanelSider({ collapsed }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { pathname } = location;

  const isAdmin = user?.role !== null && user.role === ROLE_ADMIN;
  // const isManager = user?.role !== null && user.role === ROLE_MANAGER;
  // const isEmployee = user?.role !== null && user.role === ROLE_EMPLOYEE;

  const calcSelectedKey = () => {
    if (pathname.includes("dashboard")) return "1";
    if (pathname.includes("managers")) return "2";
    if (pathname.includes("provinces")) return "3";
    if (pathname.includes("theaters")) return "4";
    if (pathname.includes("feedback")) return "5";
    if (pathname.includes("report")) return "6";
  };

  const selectedKey = calcSelectedKey();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="h-screen sticky top-0 left-0 bottom-0 bg-gray-900"
    >
      <div className="h-16 text-gray-50 font-bold tracking-wider text-2xl flex items-center justify-center mb-2">
        {collapsed ? "🍿" : "CINEMAX"}
      </div>
      <Menu
        className="bg-gray-900! text-white tracking-wide space-y-2"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={[
          {
            key: "1",
            icon: <MdSpaceDashboard />,
            label: <Link to="dashboard">Dashboard</Link>,
          },
          isAdmin && {
            key: "2",
            icon: <MdAccountCircle />,
            label: <Link to="managers">Managers</Link>,
          },
          isAdmin && {
            key: "3",
            icon: <TbCertificate />,
            label: <Link to="provinces">Provinces</Link>,
          },
          isAdmin && {
            key: "4",
            icon: <IoIosNotifications />,
            label: <Link to="theaters">Theaters</Link>,
          },
          {
            key: "5",
            icon: <MdFeedback />,
            label: <Link to="feedback">Feedbacks</Link>,
          },
          {
            key: "6",
            icon: <MdReport />,
            label: <Link to="report">Report</Link>,
          },
        ]}
      />
    </Sider>
  );
}

export default ControlPanelSider;
