import { useSelector } from "react-redux";
import AccessDenied from "../../pages/AccessDenied";
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_MANAGER } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RoleBaseRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    if (user?.role === ROLE_ADMIN) {
      navigate("theaters", { replace: false });
    } else if (user?.role === ROLE_MANAGER) {
      navigate("dashboard", { replace: false });
    } else if (user?.role === ROLE_EMPLOYEE) {
      navigate("concessions", { replace: false });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) return <AccessDenied />;
  return children;
}

export default RoleBaseRoute;
