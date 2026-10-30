import React from 'react';
import ReactDOM from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root")!);

const env = import.meta.env;
const missing = ["VITE_CLERK_PUBLISHABLE_KEY", "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"].filter(
  (name) => !env[name]
);

if (missing.length) {
  // Without these keys the app crashes on load with a blank page, so explain what's missing instead.
  root.render(
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "15vh auto", padding: 24, lineHeight: 1.5 }}>
      <h1>NuvioFit needs setup</h1>
      <p>These environment variables are not set:</p>
      <ul>
        {missing.map((name) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>
      <p>
        Copy <code>.env.example</code> to <code>.env.local</code>, fill in your keys, and restart the dev server.
        The README has step-by-step setup.
      </p>
    </div>
  );
} else {
  // Imported lazily so the Supabase client isn't created before the check above.
  import('./App.tsx').then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      </React.StrictMode>
    );
  });
}
