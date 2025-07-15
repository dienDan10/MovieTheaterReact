import { useSelector } from "react-redux";
import PageNotFound from "./PageNotFound";
import LoginBackground from "../components/LoginBackground";
import ForgotPasswordForm from "../features/auth/ForgotPasswordForm";

function ForgotPassword() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) return <PageNotFound />;

  return (
    <>
      <LoginBackground />
      <ForgotPasswordForm />
    </>
  );
}

export default ForgotPassword;
