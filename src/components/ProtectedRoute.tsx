import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
};

export const ProtectedRoute = ({ children, requireOnboardingComplete = true }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, isOnboardingComplete } = useUserContext();

  useEffect(() => {
    if (!userProfile) {
      navigate("/getting-started", { replace: true });
      return;
    }

    if (requireOnboardingComplete && !isOnboardingComplete) {
      navigate("/getting-started", { replace: true });
      return;
    }

    if (location.pathname === "/getting-started" && isOnboardingComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [userProfile, isOnboardingComplete, navigate, location, requireOnboardingComplete]);

  if (
    !userProfile ||
    (requireOnboardingComplete && !isOnboardingComplete && location.pathname !== "/getting-started")
  ) {
    return null;
  }

  return <>{children}</>;
};
