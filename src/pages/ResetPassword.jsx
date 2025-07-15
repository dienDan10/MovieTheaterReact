import { useSelector } from "react-redux";
import LoginBackground from "../components/LoginBackground";
import ResetPasswordForm from "../features/auth/ResetPasswordForm";
import PageNotFound from "./PageNotFound";

function ResetPassword() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) return <PageNotFound />;

  return (
    <>
      <LoginBackground />
      <ResetPasswordForm />
    </>
  );
}

export default ResetPassword;
