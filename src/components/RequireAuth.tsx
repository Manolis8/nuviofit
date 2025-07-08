// src/components/RequireAuth.tsx
import React from 'react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';

type Props = {
  children: React.ReactNode;
};

const RequireAuth: React.FC<Props> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) return <RedirectToSignIn />;

  return <>{children}</>;
};

export default RequireAuth;
