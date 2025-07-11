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

    // User not signed in: redirect to /auth/login or /getting-started
    if (!userProfile) {
      setRedirecting(true);
      navigate("/getting-started", { replace: true });
      return;
    }

    // Onboarding incomplete and route requires it
    if (requireOnboardingComplete && !isOnboardingComplete) {
      setRedirecting(true);
      // Save the intended path so we can redirect there after onboarding
      navigate("/getting-started", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    // If onboarding is complete and user tries to access /getting-started, redirect to saved path or dashboard
    if (
      isOnboardingComplete &&
      location.pathname === "/getting-started"
    ) {
      setRedirecting(true);
      // Try to redirect to original requested page stored in state, else fallback to dashboard
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
      return;
    }
  }, [
    userProfile,
    isOnboardingComplete,
    loadingUser,
    requireOnboardingComplete,
    navigate,
    location,
  ]);

  if (loadingUser || redirecting) return <div>Loading...</div>;

  return <>{children}</>;
};
