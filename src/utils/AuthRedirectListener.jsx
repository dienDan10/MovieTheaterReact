import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eventSystem from "./events";

// This component should be used within a Router context where useNavigate is available
const AuthRedirectListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for unauthorized events and navigate to login
    const unsubscribe = eventSystem.on("auth:unauthorized", () => {
      // Don't redirect if we're already on the login page
      if (!window.location.pathname.includes("/login")) {
        // Navigate to login page without page reload
        navigate("/login", { replace: true });
      }
    });

    // Clean up event listener when component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // This component doesn't render anything
  return null;
};

export default AuthRedirectListener;
