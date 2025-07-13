import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/auth/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [user, isLoaded, navigate, location.pathname]);

  if (!isLoaded || !user) return null;

  return <>{children}</>;
};
