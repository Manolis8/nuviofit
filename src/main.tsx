import React from 'react';
import ReactDOM from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';

import App from './App.tsx';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;
const clerkFrontendApi = import.meta.env.VITE_CLERK_FRONTEND_API!;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      frontendApi={clerkFrontendApi}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
