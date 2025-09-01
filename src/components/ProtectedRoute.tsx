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
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  const { getClient } = useSupabaseClientWithAuth(); // ✅ safe, inside component

  useEffect(() => {
    if (!isLoaded) return;

    const checkAccess = async () => {
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

        if (error) console.error("Failed to fetch onboarding data:", error);

        const quizCompleted = data?.quiz_completed || false;

        if (!quizCompleted && !allowedBeforeQuiz) {
          // Block all pages except quiz page
          navigate("/quiz", { replace: true });
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, isLoaded, navigate, location.pathname, allowedBeforeQuiz, getClient]);

  if (!isLoaded || loading) return null;

  return <>{children}</>;
};
