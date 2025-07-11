import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireOnboardingComplete?: boolean;
};

export const ProtectedRoute = ({ children, requireOnboardingComplete = true }: ProtectedRouteProps) => {
  const router = useRouter();
  const { userProfile, isOnboardingComplete } = useUserContext();

  useEffect(() => {
    if (!userProfile) {
      router.replace("/getting-started");
      return;
    }

    if (requireOnboardingComplete && !isOnboardingComplete) {
      router.replace("/getting-started");
      return;
    }

    if (router.pathname === "/getting-started" && isOnboardingComplete) {
      router.replace("/dashboard");
    }
  }, [userProfile, isOnboardingComplete, router, requireOnboardingComplete]);

  if (
    !userProfile ||
    (requireOnboardingComplete && !isOnboardingComplete && router.pathname !== "/getting-started")
  ) {
    return null;
  }

  return <>{children}</>;
};
