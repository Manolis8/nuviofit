// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { userProfile, isOnboardingComplete, loadingUser } = useUserContext();

  const location = useLocation();
  const navigate = useNavigate();

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoaded || loadingUser) return;

    // User not signed in
    if (!isSignedIn) {
      navigate("/auth/login", { replace: true });
      return;
    }

    // Accessing /getting-started when already onboarded → send to dashboard
    if (location.pathname === "/getting-started" && isOnboardingComplete) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // Trying to access a protected route but not finished onboarding
    if (
      location.pathname !== "/getting-started" &&
      !isOnboardingComplete
    ) {
      navigate("/getting-started", { replace: true, state: { from: location } });
      return;
    }
  }, [
    isSignedIn,
    isLoaded,
    user,
    isOnboardingComplete,
    location,
    navigate,
    loadingUser,
  ]);

  if (!isLoaded || loadingUser || redirecting) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
