import { useUser } from "@clerk/clerk-react";
import { useUserContext } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { userProfile, loading } = useUserContext();

  // Wait until both Clerk and our custom UserContext have loaded
  if (!isLoaded || loading) {
    return <div>Loading...</div>; // You can use a spinner here
  }

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" />;
  }

  // If userProfile doesn't exist yet (still null or undefined)
  if (!userProfile) {
    return <div>Loading user profile...</div>;
  }

  // If the user hasn't completed onboarding
  if (userProfile.setupFinished === false) {
    return <Navigate to="/getting-started" />;
  }

  // Everything OK – allow access to protected page
  return <>{children}</>;
};

export default RequireAuth;
