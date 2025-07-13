import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useUser } from "@clerk/clerk-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
};

export const ProtectedRoute = ({
  children,
  requireOnboardingComplete = true,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { isOnboardingComplete, loadingUser } = useUserContext();

  useEffect(() => {
    if (loadingUser) return;

    if (!user) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!isOnboardingComplete && location.pathname !== "/getting-started") {
      navigate("/getting-started", { replace: true });
      return;
    }

    if (isOnboardingComplete && location.pathname === "/getting-started") {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [user, isOnboardingComplete, loadingUser, location.pathname, navigate]);

  if (loadingUser || !user) return null;

  return <>{children}</>;
};
