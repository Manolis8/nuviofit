// src/GAListener.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from './analytics';

const GAListener = (): null => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default GAListener;
