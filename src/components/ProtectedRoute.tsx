import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [user, navigate, location.pathname]);

  if (!user) return null;

  return <>{children}</>;
};
