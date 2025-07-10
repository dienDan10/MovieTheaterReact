import { useSelector } from "react-redux";
import PageNotFound from "./PageNotFound";
import LoginBackground from "../components/LoginBackground";
import RegisterForm from "../features/auth/RegisterForm";

function Register() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) return <PageNotFound />;

  return (
    <>
      <LoginBackground />
      <RegisterForm />
    </>
  );
}

export default Register;
