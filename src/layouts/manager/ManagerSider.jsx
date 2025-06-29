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
import { Link, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function ManagerSider({ collapsed }) {
  const location = useLocation();
  const { pathname } = location;

  const calcSelectedKey = () => {
    if (pathname.includes("dashboard")) return "1";
    if (pathname.includes("accounts")) return "2";
    if (pathname.includes("exams")) return "3";
    if (pathname.includes("announcement")) return "4";
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
          {
            key: "2",
            icon: <MdAccountCircle />,
            label: <Link to="accounts">Accounts</Link>,
          },
          {
            key: "3",
            icon: <TbCertificate />,
            label: <Link to="exams">Exams</Link>,
          },
          {
            key: "4",
            icon: <IoIosNotifications />,
            label: <Link to="announcement">Announcements</Link>,
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

export default ManagerSider;
