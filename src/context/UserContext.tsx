import React, { createContext, useContext, useState, ReactNode } from "react";
import { Exercise } from "@/components/lib/frontendOpenai";
import { supabase } from "@/components/lib/supabaseClient";
import { useUser } from "@clerk/clerk-react";

export interface UserProfile {
  setupFinished?: boolean;
}

type FitnessPlan = {
  exercises: Exercise[];
  totalDays: number;
  createdAt: Date;
  notes?: string[];
  recommendations?: string[];
};

type UserContextType = {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  fitnessPlan: FitnessPlan | null;
  isOnboardingComplete: boolean;
  loading: boolean;
  loadingUser: boolean;
  setFitnessPlan: (plan: FitnessPlan) => void;
  hasCustomPlan: boolean;
  setHasCustomPlan: (value: boolean) => void;
  setupFinished: boolean;
  setSetupFinished: (value: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [hasCustomPlan, setHasCustomPlan] = useState<boolean>(false);
  const isOnboardingComplete = !!userProfile && hasCustomPlan;
  const [loading, setLoading] = useState(true);
  const [setupFinished, setSetupFinished] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const { user } = useUser();

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        setLoadingUser(false);
        return;
      }

      const userId = user.id;

      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching onboarding data:", error);
        setLoading(false);
        setLoadingUser(false);
        return;
      }

      if (data) {
        setFitnessPlan(data.fitness_plan || null);
        setSetupFinished(data.setupFinished || false);
        // If you later expand UserProfile, you could set real data here
        setUserProfile({ setupFinished: data.setupFinished });
      }

      setLoading(false);
      setLoadingUser(false);
    };

    fetchUserData();
  }, [user]);



  return (
    <UserContext.Provider
      value={{
        loadingUser,
        userProfile,
        setUserProfile,
        fitnessPlan,
        setFitnessPlan,
        hasCustomPlan,
        setHasCustomPlan,
        isOnboardingComplete,
        setupFinished,
        setSetupFinished,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
