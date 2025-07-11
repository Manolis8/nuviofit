import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useUser();
  const { loadingUser, isOnboardingComplete } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate("/auth/login", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Don’t render anything until Clerk is ready
  if (!isLoaded) return null;

  // Optional: If you're using onboarding flow
  if (loadingUser) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
