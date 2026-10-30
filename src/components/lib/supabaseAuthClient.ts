import { useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

export const useSupabaseClientWithAuth = () => {
  const { getToken } = useAuth();

  const getClient = async () => {
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

  return { getClient };
};

