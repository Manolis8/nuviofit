import { supabase } from './supabaseClient';
import { useAuth } from '@clerk/clerk-react';

export function useSupabaseWithClerk() {
  const { getToken } = useAuth();

  const withAuth = async (callback: (client: typeof supabase, token: string) => Promise<any>) => {
    const token = await getToken({ template: 'supabase' });

    if (!token) {
      console.error('No token received from Clerk');
      return null;
    }

    // For Supabase v2, we pass the token in headers when making requests
    return callback(supabase, token);
  };

  return { withAuth };
}
