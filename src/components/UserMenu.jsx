import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ROLE_MANAGER } from "../utils/constant";
import { AiOutlineLogout } from "react-icons/ai";
import { Avatar, Dropdown } from "antd";
import { FaUser } from "react-icons/fa6";
import { doLogoutAction } from "../redux/userSlice";

function UserMenu() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();

  const onSignOutClick = () => {
    // First remove the token
    localStorage.removeItem("accessToken");
    dispatch(doLogoutAction());
    window.location.href = "/login";
  };

  const items = [
    {
      label: (
        <div>
          <span className="block text-sm text-gray-900 ">{user?.name}</span>
          <span className="w-36 block text-sm text-gray-500 truncate">
            {user?.email}
          </span>
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    pathname.includes("manager") && {
      key: "1",
      label: <Link to={"/"}>Home page</Link>,
    },
    // user.role !== ADMIN && {
    //   label: <Link to={"/personal-banks"}>My question banks</Link>,
    //   key: "2",
    // },
    user.role?.includes(ROLE_MANAGER) &&
      !pathname.includes("manager") && {
        label: <Link to={"/manager"}>Dashboard</Link>,
        key: "3",
      },
    {
      label: (
        <span
          onClick={onSignOutClick}
          className="flex gap-2 justify-start items-center w-full "
        >
          <span>
            <AiOutlineLogout className="text-red-500" />
          </span>
          <span>Sign out</span>
        </span>
      ),
      key: "4",
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      {/* <img
        className="w-8 h-8 rounded-full cursor-pointer"
        src="default-user.jpg"
        alt="user-photo"
      /> */}
      <Avatar
        icon={<FaUser />}
        style={{
          backgroundColor: "#ffffff",
          color: "#1c375b",
          cursor: "pointer",
        }}
      />
    </Dropdown>
  );
}

export default UserMenu;
