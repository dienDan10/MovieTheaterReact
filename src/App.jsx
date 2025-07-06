import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import MainLayout from "./layouts/main/MainLayout";
import PageNotFound from "./pages/PageNotFound";
import { SpinnerLarge } from "./components/Spinner";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "./redux/notificationSlice";
import FetchUserProfile from "./features/auth/FetchUserProfile";
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ManagerLayout = lazy(() => import("./layouts/manager/ManagerLayout"));
const AccountLayout = lazy(() =>
  import("./features/manager/accounts/AccountLayout")
);
const HomePage = lazy(() => import("./pages/HomePage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<SpinnerLarge />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<SpinnerLarge />}>
            <Register />
          </Suspense>
        ),
      },
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: (
          <Suspense fallback={<SpinnerLarge />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/manager",
    element: (
      <Suspense fallback={<SpinnerLarge />}>
        <ManagerLayout />
      </Suspense>
    ),
    errorElement: <PageNotFound />,
    children: [
      {
        path: "accounts",
        element: (
          <Suspense fallback={<SpinnerLarge />}>
            <AccountLayout />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  const [api, notificationContextHolder] = notification.useNotification();
  const notificationData = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const lastNotificationId = useRef(null);

  const { type, message, description, id } = notificationData;

  // Handle notifications
  useEffect(() => {
    if (type && message && id != lastNotificationId.current) {
      lastNotificationId.current = id;
      api[type]({
        message: message,
        description: description,
      });

      // Clear notification after displaying
      dispatch(clearNotification());
    }
  }, [type, message, description, id, api, dispatch]);

  return (
    <>
      {notificationContextHolder}
      {/* Render the router */}
      <FetchUserProfile />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
