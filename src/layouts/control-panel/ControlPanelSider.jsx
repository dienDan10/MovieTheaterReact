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
import { FaLocationDot } from "react-icons/fa6";
import { RiMovie2AiFill } from "react-icons/ri";
import { GiTheater } from "react-icons/gi";

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
    if (pathname.includes("managers")) return "managers";
    if (pathname.includes("employees")) return "employees";
    if (pathname.includes("customers")) return "customers";
    if (pathname.includes("provinces")) return "5";
    if (pathname.includes("theaters")) return "6";
    if (pathname.includes("screens")) return "7";
    if (pathname.includes("report")) return "8";
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
            label: <p>Users</p>,
            children: [
              {
                key: "managers",
                label: <Link to="managers">Managers</Link>,
              },
              {
                key: "employees",
                label: <Link to="employees">Employees</Link>,
              },
              {
                key: "customers",
                label: <Link to="customers">Customers</Link>,
              },
            ],
          },
          // isAdmin && {
          //   key: "2",
          //   icon: <MdAccountCircle />,
          //   label: <Link to="managers">Managers</Link>,
          // },
          // isAdmin && {
          //   key: "3",
          //   icon: <MdAccountCircle />,
          //   label: <Link to="employees">Employees</Link>,
          // },
          // isAdmin && {
          //   key: "4",
          //   icon: <MdAccountCircle />,
          //   label: <Link to="customers">Customers</Link>,
          // },
          isAdmin && {
            key: "5",
            icon: <FaLocationDot />,
            label: <Link to="provinces">Provinces</Link>,
          },
          isAdmin && {
            key: "6",
            icon: <RiMovie2AiFill />,
            label: <Link to="theaters">Theaters</Link>,
          },
          isAdmin && {
            key: "7",
            icon: <GiTheater />,
            label: <Link to="screens">Screens</Link>,
          },
          {
            key: "8",
            icon: <MdReport />,
            label: <Link to="report">Report</Link>,
          },
        ]}
      />
    </Sider>
  );
}

export default ControlPanelSider;
