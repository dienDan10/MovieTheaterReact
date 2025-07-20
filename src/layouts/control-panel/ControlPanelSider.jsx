import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  MdAccountCircle,
  MdChair,
  MdFastfood,
  MdOutlinePlaylistAddCheckCircle,
  MdSpaceDashboard,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_MANAGER } from "../../utils/constant";
import { FaLocationDot, FaTicket } from "react-icons/fa6";
import { RiMovie2AiFill } from "react-icons/ri";
import { GiTheater } from "react-icons/gi";

function ControlPanelSider({ collapsed }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { pathname } = location;

  const isAdmin = user?.role !== null && user.role === ROLE_ADMIN;
  const isManager = user?.role !== null && user.role === ROLE_MANAGER;
  const isEmployee = user?.role !== null && user.role === ROLE_EMPLOYEE;

  const calcSelectedKey = () => {
    if (pathname.includes("revenue")) return "1";
    if (pathname.includes("managers")) return "managers";
    if (pathname.includes("employees")) return "employees";
    if (pathname.includes("customers")) return "customers";
    if (pathname.includes("provinces")) return "5";
    if (pathname.includes("theaters")) return "6";
    if (pathname.includes("screens")) return "7";
    if (pathname.includes("seats")) return "8";
    if (pathname.includes("movies")) return "9";
    if (pathname.includes("showtimes")) return "10";
    if (pathname.includes("concessions")) return "11";
    if (pathname.includes("checkin")) return "12";
    if (pathname.includes("booking")) return "13";
  };

  const selectedKey = calcSelectedKey();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="h-screen sticky! top-0 left-0 bottom-0 bg-gray-900"
    >
      <div className="h-16 text-gray-50 font-bold tracking-wider text-2xl flex items-center justify-center mb-2">
        {collapsed ? "🍿" : "CINEMAX"}
      </div>
      <Menu
        className="bg-gray-900! text-white tracking-wide space-y-2"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={[
          isManager && {
            key: "1",
            icon: <MdSpaceDashboard />,
            label: <Link to="revenue">Revenue</Link>,
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
          (isAdmin || isManager) && {
            key: "7",
            icon: <GiTheater />,
            label: <Link to="screens">Screens</Link>,
          },
          (isAdmin || isManager) && {
            key: "8",
            icon: <MdChair />,
            label: <Link to="seats">Seats</Link>,
          },
          isManager && {
            key: "9",
            icon: <RiMovie2AiFill />,
            label: <Link to="movies">Movies</Link>,
          },
          isManager && {
            key: "10",
            icon: <GiTheater />,
            label: <Link to="showtimes">ShowTimes</Link>,
          },
          (isManager || isEmployee) && {
            key: "11",
            icon: <MdFastfood />,
            label: <Link to="concessions">Concessions</Link>,
          },
          isEmployee && {
            key: "12",
            icon: <MdOutlinePlaylistAddCheckCircle />,
            label: <Link to="checkin">Checkin</Link>,
          },
          isEmployee && {
            key: "13",
            icon: <FaTicket />,
            label: <Link to="booking">Book Ticket</Link>,
          },
        ]}
      />
    </Sider>
  );
}

export default ControlPanelSider;
