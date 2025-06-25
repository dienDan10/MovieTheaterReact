import { Avatar } from "antd";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import MainSideNav from "../../components/MainSideNav";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <>
      <MainSideNav isOpen={isOpen} setIsOpen={setIsOpen} />

      <header className="font-sans leading-normal tracking-normal">
        <nav
          style={{ borderBottom: "1px solid #c1c0c04a" }}
          id="navBarHeader"
          className="transition-all duration-500 flex items-center justify-between flex-wrap bg-neutral-900 py-3 px-4 md:py-4 fixed w-full z-10 top-0"
        >
          <div className="flex items-center flex-shrink-0 text-white mr-4 md:mx-5">
            <NavLink
              to="/"
              aria-label="Back to homepage"
              className="flex items-center"
            >
              <span className="text-xl sm:text-2xl md:text-3xl">🍿</span>
              <span className="text-xl font-medium text-red-500 uppercase sm:text-2xl ">
                Cinemax
              </span>
            </NavLink>
          </div>
          <div className="block lg:hidden">
            <button
              onClick={() => setIsOpen(true)}
              id="nav-toggle"
              className="flex items-center px-2 hover:cursor-pointer py-1.5 border rounded text-gray-500 border-red-500"
            >
              <svg
                className="fill-current h-4 w-4 text-red-500"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          <div
            className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden  pt-3 lg:pt-0"
            id="nav-content"
          >
            <ul className="list-reset lg:flex justify-center flex-1 items-center mb-0">
              <li className="mr-3">
                <Link
                  to="/"
                  className="decoration-none text-slate-100 uppercase font-semibold px-2.5 py-1.5 hover:bg-red-500 rounded-md transition-all"
                >
                  Phim
                </Link>
              </li>
              <li className="mr-3">
                <Link
                  className="decoration-none text-slate-100 uppercase font-semibold px-2.5 py-1.5 hover:bg-red-500 rounded-md transition-all"
                  to="/"
                >
                  Booking
                </Link>
              </li>
            </ul>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/inforUser"
                    className="flex flex-row items-center justify-center border-r-2 border-gray-300 pr-2"
                  >
                    <div className="relative">
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-600 border rounded-full border-gray-50" />
                      <Avatar
                        style={{
                          backgroundColor: "#f56a00",
                          verticalAlign: "middle",
                        }}
                        icon={<FaRegUser />}
                      />
                    </div>
                    <div>
                      <h5 className="m-0 pl-2 text-center">
                        {user?.name || "username"}
                      </h5>
                    </div>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="login"
                    className=" text-slate-100 px-2.5 py-1 flex items-center self-center bg-red-500 rounded-sm font-semibold"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="register"
                    className="text-slate-200 px-2.5 py-1 border-[1px] rounded-sm hover:border-red-500 hover:bg-red-500 transition-all font-semibold"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </nav>
        {/* Add a spacer div to prevent content from being hidden under the fixed header */}
        <div className="h-16 md:h-20"></div>
      </header>
    </>
  );
}

export default Header;
