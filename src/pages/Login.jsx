import { useSelector } from "react-redux";
import PageNotFound from "./PageNotFound";
import LoginBackground from "../components/LoginBackground";
import LoginForm from "../features/auth/LoginForm";

function Login() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) return <PageNotFound />;

  return (
    <>
      <LoginBackground />
      <LoginForm/>
    </>
  );
}

export default Login;
