import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedBeforeQuiz?: boolean;
};

export const ProtectedRoute = ({
  children,
  allowedBeforeQuiz = false,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Always at the top
  const { user, isLoaded } = useUser();
  const supabaseHook = useSupabaseClientWithAuth(); // do not destructure here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run when Clerk is loaded
    if (!isLoaded) return;

    const checkAccess = async () => {
      if (!user) {
        navigate("/auth/login", { replace: true, state: { from: location.pathname } });
        return;
      }

      try {
        const supabaseAuthClient = await supabaseHook.getClient(); // safe, hook already called

        if (!supabaseAuthClient) {
          console.error("Supabase client not ready");
          setLoading(false);
          return;
        }

        const { data, error } = await supabaseAuthClient
          .from("onboarding_responses")
          .select("quiz_completed")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) console.error("Failed to fetch onboarding data:", error);

        const quizCompleted = data?.quiz_completed || false;

        if (!quizCompleted && !allowedBeforeQuiz) {
          navigate("/getting-started", { replace: true });
        }

        setLoading(false);
      } catch (err) {
        console.error("ProtectedRoute error:", err);
        setLoading(false);
      }
    };

    checkAccess();
  }, [isLoaded, user, navigate, location.pathname, allowedBeforeQuiz, supabaseHook]);

  if (!isLoaded || loading) return null;

  return <>{children}</>;
};
