import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedBeforeQuiz?: boolean; // true for the quiz page
};

export const ProtectedRoute = ({
  children,
  allowedBeforeQuiz = false,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
      const { getClient } = useSupabaseClientWithAuth();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const checkAccess = async () => {
      if (!user) {
        // Not signed in
        navigate("/auth/login", { replace: true, state: { from: location.pathname } });
        return;
      }

      const supabase = await getClient();
      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("quiz_completed")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch onboarding data:", error);
      }

      const completed = data?.quiz_completed || false;
      setQuizCompleted(completed);

      // Block all pages except quiz page if quiz not completed
      if (!completed && !allowedBeforeQuiz) {
        navigate("/quiz", { replace: true });
      }

      setLoading(false);
    };

    checkAccess();
  }, [user, isLoaded, navigate, location.pathname, allowedBeforeQuiz]);

  if (!isLoaded || loading) return null;

  return <>{children}</>;
};
