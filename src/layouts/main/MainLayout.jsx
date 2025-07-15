import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ROLE_CUSTOMER } from "../../utils/constant";
import AccessDenied from "../../pages/AccessDenied";

function MainLayout() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isCustomer, setIsCustomer] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isAuthenticated && user?.role !== ROLE_CUSTOMER) {
      setIsCustomer(false);
    } else if (isAuthenticated && user?.role === ROLE_CUSTOMER) {
      setIsCustomer(true);
    }
  }, [isAuthenticated, user]);

  return (
    <div>
      <Header />
      {isCustomer ? <Outlet /> : <AccessDenied />}
      <Footer />
    </div>
  );
}

export default MainLayout;
