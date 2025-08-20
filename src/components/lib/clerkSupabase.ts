// src/lib/clerkSupabase.ts
import { supabase } from './supabaseClient';
import { useAuth } from '@clerk/clerk-react';

export const useClerkSupabase = () => {
  const { getToken } = useAuth();

  const signInToSupabase = async () => {
    try {
      // Get JWT from Clerk (make sure template is "supabase" or whatever you called it)
      const token = await getToken({ template: 'supabase' });

      // Sign in to Supabase using OIDC
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'oidc',
        token,
      });

      if (error) console.error('Supabase login failed:', error);
      else console.log('Supabase login successful', data);

      return data;
    } catch (err) {
      console.error('Error getting Clerk token:', err);
      return null;
    }
  };

  return { signInToSupabase };
};
