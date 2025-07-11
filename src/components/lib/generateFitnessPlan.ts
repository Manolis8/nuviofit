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
import  { ProtectedRoute }  from "./components/ProtectedRoute";


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
            <Route path="/about" element={<About />} />
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
                    <ProtectedRoute>
                  <Dashboard />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/mindset"
              element={
                    <ProtectedRoute>
                  <MoodTracker />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/workout-page"
              element={
                    <ProtectedRoute>
                  <WorkoutPage />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/the-arena"
              element={
                    <ProtectedRoute>
                  <Arena />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                    <ProtectedRoute>
                  <Nutrition />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                   <ProtectedRoute>
                  <GoalTracker />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/getting-started"
              element={
                    <ProtectedRoute>
                  <GettingStarted />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                    <ProtectedRoute>
                  <CalendarView />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                    <ProtectedRoute>
                  <Profile />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/user-info"
              element={
                   <ProtectedRoute>
                  <Userinfo />
                    </ProtectedRoute>
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
