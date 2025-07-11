import { useRouter } from "next/router";
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
  const router = useRouter();
  const { userProfile, isOnboardingComplete, loadingUser } = useUserContext(); // Add `loadingUser`

  useEffect(() => {
    if (loadingUser) return; // wait for user to load

    // Not signed in → go to getting started
    if (!userProfile) {
      router.replace("/getting-started");
    }

    // User signed in but hasn't completed onboarding
    else if (requireOnboardingComplete && !isOnboardingComplete) {
      router.replace("/getting-started");
    }

    // User has finished onboarding but tries to go back to getting started
    else if (!requireOnboardingComplete && isOnboardingComplete && router.pathname === "/getting-started") {
      router.replace("/dashboard");
    }
  }, [userProfile, isOnboardingComplete, loadingUser, router, requireOnboardingComplete]);

  // Don’t flash content while deciding
  if (loadingUser || !userProfile) return null;

  // Prevent showing getting-started during onboarding
  if (requireOnboardingComplete && !isOnboardingComplete) return null;

  return <>{children}</>;
};
