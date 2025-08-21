// src/lib/useSupabaseWithClerk.ts
import { supabase } from './supabaseClient';
import { useAuth } from '@clerk/clerk-react';

export function useSupabaseWithClerk() {
  const { getToken } = useAuth();

  const withAuth = async (callback: (client: typeof supabase) => Promise<any>) => {
    const token = await getToken({ template: 'supabase' });

    if (!token) {
      console.error('No token received from Clerk');
      return null;
    }

    // Attach the Clerk JWT to Supabase
await supabase.auth.setSession({
  access_token: token,
  refresh_token: '',
});


    // Run whatever query is passed in
    return callback(supabase);
  };

  return { withAuth };
}
