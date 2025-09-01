import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import type { SupabaseClient } from "@supabase/supabase-js";
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
  const { getClient } = useSupabaseClientWithAuth();

  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const checkAccess = async () => {
      if (!user) {
        navigate("/auth/login", { replace: true, state: { from: location.pathname } });
        return;
      }

      try {
        const supabase: SupabaseClient = await getClient();

        const { data, error } = await supabase
          .from("onboarding_responses")
          .select("quiz_completed")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error);
          setLoading(false);
          return;
        }

        // Create record if missing
        if (!data) {
          const { data: newData, error: insertError } = await supabase
            .from("onboarding_responses")
            .insert({ user_id: user.id, quiz_completed: false })
            .select()
            .single();

          if (insertError) {
            console.error("Insert error:", insertError);
            setLoading(false);
            return;
          }

          setQuizCompleted(newData.quiz_completed);
        } else {
          setQuizCompleted(data.quiz_completed);
        }

        // Redirect if quiz incomplete
        if (!data?.quiz_completed && !allowedBeforeQuiz) {
          navigate("/getting-started", { replace: true });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [isLoaded, user, getClient, navigate, location.pathname, allowedBeforeQuiz]);

  if (!isLoaded || loading || quizCompleted === null) return null;

  return <>{children}</>;
};
