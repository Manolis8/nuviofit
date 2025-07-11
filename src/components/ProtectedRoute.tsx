import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

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
  const {
    userProfile,
    isOnboardingComplete,
    loadingUser,
  } = useUserContext();

  useEffect(() => {
    if (loadingUser) return;

    if (!userProfile) {
      navigate("/getting-started", { replace: true });
    } else if (requireOnboardingComplete && !isOnboardingComplete) {
      navigate("/getting-started", { replace: true });
    } else if (
      !requireOnboardingComplete &&
      isOnboardingComplete &&
      location.pathname === "/getting-started"
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [
    userProfile,
    isOnboardingComplete,
    loadingUser,
    requireOnboardingComplete,
    navigate,
    location.pathname,
  ]);

  if (loadingUser || !userProfile) return null;
  if (requireOnboardingComplete && !isOnboardingComplete) return null;

  return <>{children}</>;
};
