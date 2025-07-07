import { Avatar, Drawer, Space } from "antd";
import { FaUser, FaXmark } from "react-icons/fa6";
import { RiLoginCircleFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function MainSideNav({ isOpen, setIsOpen }) {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  return (
    <Drawer
      title="Cinemax"
      placement="left"
      closable={false}
      onClose={() => setIsOpen(false)}
      open={isOpen}
      width="300px"
      key="left"
      extra={
        <Space>
          <FaXmark onClick={() => setIsOpen(false)} />
        </Space>
      }
      style={{
        backgroundColor: "oklch(26.9% 0 0)",
        color: "oklch(96.8% 0.007 247.896)",
      }}
      className="custom-drawer"
    >
      <div>
        {isAuthenticated ? (
          <>
            <div className="flex flex-col items-center justify-center gap-2 mb-4">
              <Avatar
                icon={<FaUser />}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#1c375b",
                }}
              />
              <p>{user.name}</p>
            </div>
          </>
        ) : (
          <>
            <NavLink
              to="login"
              className="flex items-center justify-center gap-2 uppercase px-3 py-2 mb-4 bg-red-700! rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all! shadow-slate-500"
            >
              <RiLoginCircleFill className="text-slate-100" />
              <span className="text-slate-100 font-semibold">Login</span>
            </NavLink>
            <NavLink
              to="register"
              className="flex items-center justify-center gap-2 uppercase px-3 py-2 mb-4 border-[1px] border-red-700 rounded-lg hover:border-0 hover:bg-red-700! transition-all! shadow-slate-500"
            >
              <span className="text-slate-100 font-semibold">Register</span>
            </NavLink>
          </>
        )}
      </div>
      <hr />
      <ul className="list-reset justify-center flex-1 items-center mt-2">
        <li className="mr-3">
          <NavLink
            to="/"
            className="block py-2 px-4 text-slate-100! uppercase hover:underline! transition-all!"
          >
            Home
          </NavLink>
        </li>
        <li className="mr-3">
          <NavLink
            className="block py-2 px-4 text-slate-100! uppercase hover:underline! transition-all!"
            to="news"
          >
            News
          </NavLink>
        </li>
        <li className="mr-3">
          <NavLink
            to="/manage/movies"
            className="block py-2 px-4 text-slate-100! uppercase hover:underline! transition-all!"
          >
            Movie Management
          </NavLink>
        </li>
        <li className="mr-3">
          <NavLink
            to="/manage/showtimes"
            className="block py-2 px-4 text-slate-100! uppercase hover:underline! transition-all!"
          >
            ShowTime Management
          </NavLink>
        </li>
      </ul>
    </Drawer>
  );
}

export default MainSideNav;
