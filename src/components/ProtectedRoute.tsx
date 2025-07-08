import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext"; // adjust if needed

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
};

export const ProtectedRoute = ({ children, requireOnboardingComplete = true }: ProtectedRouteProps) => {
  const router = useRouter();
  const { userProfile, isOnboardingComplete } = useUserContext();

  useEffect(() => {
    // If not signed in, redirect to /getting-started
    if (!userProfile) {
      router.replace("/getting-started");
    }
    // If onboarding not complete, redirect to /getting-started
    else if (requireOnboardingComplete && !isOnboardingComplete) {
      router.replace("/getting-started");
    }
    // If trying to access /getting-started after onboarding, redirect to /dashboard
    else if (router.pathname === "/getting-started" && isOnboardingComplete) {
      router.replace("/dashboard");
    }
  }, [userProfile, isOnboardingComplete, router, requireOnboardingComplete]);

  // Show nothing while redirecting
  if (!userProfile || (requireOnboardingComplete && !isOnboardingComplete && router.pathname !== "/getting-started")) {
    return null;
  }

  return <>{children}</>;
};
