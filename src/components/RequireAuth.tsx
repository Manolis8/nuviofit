import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { setupFinished } = useUserContext();
  const location = useLocation();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  const onGettingStarted = location.pathname === "/getting-started";

  if (!setupFinished && !onGettingStarted) {
    return <Navigate to="/getting-started" replace />;
  }

  if (setupFinished && onGettingStarted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
