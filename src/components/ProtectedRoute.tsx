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
      console.log("🔒 Redirecting to /getting-started (not signed in)");
      navigate("/getting-started", { replace: true });
    } else if (requireOnboardingComplete && !isOnboardingComplete) {
      console.log("🔒 Redirecting to /getting-started (onboarding not complete)");
      navigate("/getting-started", { replace: true });
    } else if (
      !requireOnboardingComplete &&
      isOnboardingComplete &&
      location.pathname === "/getting-started"
    ) {
      console.log("✅ Redirecting to /dashboard (already onboarded)");
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

  // Render a loading state while user is being fetched
  if (loadingUser) return <div>Loading...</div>;

  // Block render if no user (router will redirect)
  if (!userProfile) return null;

  // Block render if onboarding is required but not done
  if (requireOnboardingComplete && !isOnboardingComplete) return null;

  return <>{children}</>;
};
