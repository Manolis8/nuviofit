import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";

export const getSupabaseClientWithAuth = async () => {
const { getToken } = useAuth(); // Clerk JWT
  const token = await getToken({ template: "supabase" });

  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );
};
