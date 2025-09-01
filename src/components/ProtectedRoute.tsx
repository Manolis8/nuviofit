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

  // ✅ Hooks always at the top
  const { user, isLoaded } = useUser();
  const { getClient } = useSupabaseClientWithAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoaded) return;

      if (!user) {
        navigate("/auth/login", { replace: true, state: { from: location.pathname } });
        return;
      }

      try {
        const supabaseAuthClient = await getClient();

        const { data, error } = await supabaseAuthClient
          .from("onboarding_responses")
          .select("quiz_completed")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) console.error(error);

        const quizCompleted = data?.quiz_completed || false;

        if (!quizCompleted && !allowedBeforeQuiz) {
          navigate("/getting-started", { replace: true });
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, isLoaded, getClient, navigate, location.pathname, allowedBeforeQuiz]);

  if (!isLoaded || loading) return null;

  return <>{children}</>;
};
