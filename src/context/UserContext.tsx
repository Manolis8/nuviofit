import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";

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
  const { userProfile, isOnboardingComplete } = useUserContext();

  useEffect(() => {
    // If no user, redirect to onboarding
    if (!userProfile) {
      navigate("/getting-started", { replace: true });
      return;
    }

    // If onboarding is required and incomplete, redirect to onboarding
    if (requireOnboardingComplete && !isOnboardingComplete) {
      navigate("/getting-started", { replace: true });
      return;
    }

    // If onboarding is complete but user is on the onboarding page, redirect to dashboard
    if (location.pathname === "/getting-started" && isOnboardingComplete) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [userProfile, isOnboardingComplete, location.pathname, navigate, requireOnboardingComplete]);

  // Block rendering children until user is available and passes checks
  const shouldBlockRender =
    !userProfile ||
    (requireOnboardingComplete &&
      !isOnboardingComplete &&
      location.pathname !== "/getting-started") ||
    (requireOnboardingComplete &&
      isOnboardingComplete &&
      location.pathname === "/getting-started");

  if (shouldBlockRender) return null;

  return <>{children}</>;
};
