// src/components/RequireAuth.tsx
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const RequireAuth: React.FC<Props> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) return <Navigate to="/auth/sign-up" replace />;

  return <>{children}</>;
};

export default RequireAuth;
