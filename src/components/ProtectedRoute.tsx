import { useEffect, useState } from "react";
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

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (loadingUser) return;

    if (!userProfile) {
      console.log("🔒 Redirecting to /getting-started (not signed in)");
      setRedirecting(true);
      navigate("/getting-started", { replace: true });
    } else if (requireOnboardingComplete && !isOnboardingComplete) {
      console.log("🔒 Redirecting to /getting-started (onboarding not complete)");
      setRedirecting(true);
      navigate("/getting-started", { replace: true });
    } else if (
      !requireOnboardingComplete &&
      isOnboardingComplete &&
      location.pathname === "/getting-started"
    ) {
      console.log("✅ Redirecting to /dashboard (already onboarded)");
      setRedirecting(true);
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

  if (loadingUser || redirecting) return <div>Loading...</div>;

  return <>{children}</>;
};
