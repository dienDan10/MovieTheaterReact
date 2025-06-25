import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import {
  FaAngleRight,
  FaAnglesRight,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa6";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="px-4 divide-y bg-neutral-900 text-gray-100">
      <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
        <div className="lg:w-1/4">
          <NavLink
            to="/"
            aria-label="Back to homepage"
            className="flex items-center"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl">🍿</span>
            <span className="text-2xl font-medium text-red-500 uppercase sm:text-3xl md:text-4xl">
              Cinemax
            </span>
          </NavLink>
        </div>
        <div className="grid grid-cols-1 text-sm gap-x-3 gap-y-8 lg:w-3/4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="hidden sm:block space-y-3">
            <h3 className="tracking-wide text-zinc-200 title-widget text-sm sm:text-lg font-medium">
              GIỚI THIỆU
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> VỀ CHÚNG TÔI
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> THỎA THUẬN SỬ DỤNG
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> QUY CHẾ BẢO MẬT
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> CHÍNH SÁCH BẢO MẬT
                </a>
              </li>
            </ul>
          </div>
          <div className="hidden sm:block space-y-3">
            <h3 className="tracking-wide  text-zinc-200 title-widget text-sm sm:text-lg font-medium">
              HỖ TRỢ
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> GÓP Ý
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> SALE & SERVICE
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> RẠP / GIÁ VÉ
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  className="text-zinc-300 flex items-center gap-3 title-widget-item"
                >
                  <FaAnglesRight /> TUYỂN DỤNG
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className=" text-zinc-200 title-widget uppercase text-sm sm:text-lg font-medium">
              KẾT NỐI Cinemax
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <a
                  href="#"
                  target="_blank"
                  className="text-zinc-300 title-widget-item text-2xl"
                >
                  <FaFacebookSquare />
                </a>
                <a
                  href="#!"
                  className="text-zinc-300 title-widget-item text-2xl"
                >
                  <FaYoutubeSquare />
                </a>
                <a
                  href="#!"
                  className="text-zinc-300 title-widget-item text-2xl"
                >
                  <FaInstagramSquare />
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className=" text-zinc-200 title-widget text-sm sm:text-lg font-medium">
              DOWNLOAD APP
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <a
                  href="#!"
                  className="text-zinc-300 title-widget-item text-2xl"
                >
                  <FaApple />
                </a>
                <a
                  href="#!"
                  className="text-zinc-300 title-widget-item text-2xl"
                >
                  <FaGooglePlay />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-6 text-sm text-center text-gray-400">
        © 1968 Company Co. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
