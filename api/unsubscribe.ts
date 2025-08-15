// UnsubscribePage.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/components/lib/supabaseClient";
import jwt from "jsonwebtoken";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function UnsubscribePage() {
  const [status, setStatus] = useState("Processing...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    async function unsubscribe() {
      if (!token) return setStatus("Invalid request");

      try {
        const payload = jwt.verify(token, process.env.REACT_APP_UNSUBSCRIBE_SECRET || "supersecret") as { email: string };
        
        const { error } = await supabase
          .from("onboarding_responses")
          .update({ unsubscribed: true })
          .eq("email", payload.email);

        if (error) {
          console.error(error);
          return setStatus("Failed to unsubscribe");
        }

        setStatus("You have been unsubscribed");
        setTimeout(() => navigate("/unsubscribe-success"), 1500);
      } catch (err) {
        console.error(err);
        setStatus("Invalid or expired link");
      }
    }
    unsubscribe();
  }, [token, navigate]);

  return <div style={{ textAlign: "center", padding: "50px" }}>{status}</div>;
}

