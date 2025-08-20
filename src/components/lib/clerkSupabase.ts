// src/lib/clerkSupabase.ts
import { supabase } from './supabaseClient';
import { useAuth } from '@clerk/clerk-react';

export const useClerkSupabase = () => {
  const { getToken } = useAuth();

  const signInToSupabase = async () => {
    try {
      const token = await getToken({ template: 'supabase' });

      if (!token) {
        console.error('No token received from Clerk');
        return null;
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'clerk',
        token,
      });

      if (error) {
        console.error('Supabase login failed:', error);
        return null;
      }

      console.log('Supabase login successful', data);
      return data;
    } catch (err) {
      console.error('Error getting Clerk token:', err);
      return null;
    }
  };

  return { signInToSupabase };
};
