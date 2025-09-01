import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedBeforeQuiz?: boolean; // true for quiz/getting-started page
};

export const ProtectedRoute = ({
  children,
  allowedBeforeQuiz = false,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hooks always at the top
  const { user, isLoaded } = useUser();
  const supabaseHook = useSupabaseClientWithAuth(); // do not destructure getClient
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return; // wait until Clerk finishes loading

    const checkAccess = async () => {
      if (!user) {
        navigate("/auth/login", { replace: true, state: { from: location.pathname } });
        return;
      }

      try {
        const supabaseAuthClient = await supabaseHook.getClient();
        if (!supabaseAuthClient) {
          console.error("Supabase client not ready");
          setLoading(false);
          return;
        }

        // Fetch the user's onboarding record
        let { data, error } = await supabaseAuthClient
          .from("onboarding_responses")
          .select("quiz_completed")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Failed to fetch onboarding data:", error);
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
            console.error("Failed to create onboarding record:", insertError);
            setLoading(false);
            return;
          }

          data = newData;
        }

        const quizCompleted = data.quiz_completed;

        // Block access to protected pages if quiz not completed
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

  if (!isLoaded || loading) return null; // show nothing until check finishes

  return <>{children}</>;
};
