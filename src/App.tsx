import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ForgotPassword from './pages/ForgotPassword';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import React from "react";

// Pages & Components
import Welcome from "./pages/Welcome";
import Profile from "./components/profile/page";
import Warmup from "./pages/warmup-page";
import Dashboard from "./pages/Dashboard";
import WorkoutPage from "./pages/workout-page";
import GettingStarted from "./pages/GettingStarted";
import { CalendarView } from "./pages/calendar";
import MoodTracker from "./components/mindset/page";
import PrivacyPolicy from "./pages/Privacypolicy";
import TermsOfService from "./pages/Termsofservice";
import Nutrition from "./components/nutrition/page";
import GoalTracker from "./components/goals/page";
import Arena from "./pages/the-arena";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Userinfo from "./pages/user-info";
import AuthSplitScreen from "./components/AuthSplitScreen";

// Clerk
import { SignedIn, SignedOut } from "@clerk/clerk-react";

// 🔐 Custom Auth Protection
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route
              path="/auth/*"
              element={
                <>
                  <SignedOut>
                    <AuthSplitScreen />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/dashboard" />
                  </SignedIn>
                </>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/mindset"
              element={
                <RequireAuth>
                  <MoodTracker />
                </RequireAuth>
              }
            />
            <Route
              path="/workout-page"
              element={
                <RequireAuth>
                  <WorkoutPage />
                </RequireAuth>
              }
            />
            <Route
              path="/the-arena"
              element={
                <RequireAuth>
                  <Arena />
                </RequireAuth>
              }
            />
            <Route
              path="/nutrition"
              element={
                <RequireAuth>
                  <Nutrition />
                </RequireAuth>
              }
            />
            <Route
              path="/goals"
              element={
                <RequireAuth>
                  <GoalTracker />
                </RequireAuth>
              }
            />
            <Route
              path="/about"
              element={
                <RequireAuth>
                  <About />
                </RequireAuth>
              }
            />
            <Route
              path="/getting-started"
              element={
                <RequireAuth>
                  <GettingStarted />
                </RequireAuth>
              }
            />
            <Route
              path="/calendar"
              element={
                <RequireAuth>
                  <CalendarView />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/user-info"
              element={
                <RequireAuth>
                  <Userinfo />
                </RequireAuth>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
