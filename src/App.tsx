import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ForgotPassword from './pages/ForgotPassword';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import React from "react";
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
import { Import } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route
  path="/dashboard"
  element={
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  }
/>
            <Route path="/mindset" element={<MoodTracker />} />
            <Route path="/workout-page" element={<WorkoutPage />} />
            <Route path="/the-arena" element={<Arena />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/goals" element={<GoalTracker />} />
            <Route path="/about" element={<About />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/calendar" element={<CalendarView/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-info" element={<Userinfo />} />
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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);


export default App;
