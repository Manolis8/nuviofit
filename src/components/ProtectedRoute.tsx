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
  const supabaseHook = useSupabaseClientWithAuth();
  const [loading, setLoading] = useState(true);

  // Always show this component, hide content only while loading
  const [quizCompleted, setQuizCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoaded) return;

      if (!user) {
        navigate("/auth/login", { replace: true, state: { from: location.pathname } });
        return;
      }

      try {
        const supabaseAuthClient = await supabaseHook.getClient();
        if (!supabaseAuthClient) {
          setLoading(false);
          return;
        }

        let { data, error } = await supabaseAuthClient
          .from("onboarding_responses")
          .select("quiz_completed")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        // If no onboarding row exists, create it
        if (!data) {
          const { data: newData, error: insertError } = await supabaseAuthClient
            .from("onboarding_responses")
            .insert({ user_id: user.id, quiz_completed: false })
            .select()
            .single();

          if (insertError) {
            console.error(insertError);
            setLoading(false);
            return;
          }

          data = newData;
        }

        setQuizCompleted(data.quiz_completed);

        if (!data.quiz_completed && !allowedBeforeQuiz) {
          navigate("/getting-started", { replace: true });
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    checkAccess();
  }, [isLoaded, user, navigate, location.pathname, allowedBeforeQuiz, supabaseHook]);

  if (!isLoaded || loading || quizCompleted === null) return null;

  return <>{children}</>;
};
