import React, { createContext, useContext, useState, ReactNode } from "react";
import { Exercise } from "@/components/lib/frontendOpenai";
import { supabase } from "@/components/lib/supabaseClient";
import { useUser } from "@clerk/clerk-react";



type FitnessGoal = "lose_weight" | "build_muscle" | "improve_endurance" | "general_fitness";

export interface UserProfile {
  fitnessGoal: FitnessGoal;
  fitnessFrequency: number;
  preferredActivities?: string[];
  timePerWorkout?: number;
  name: string;
  fitnessInjuries?: string;
  additionalNotes?: string;
  email: string;
  setupFinished?: boolean,

  

}

type WorkoutNote = {
  exerciseId: string;
  note: string;
  createdAt: Date;
};

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
const [loadingUser, setLoadingUser] = useState(true); // ✅ add this

  const { user } = useUser();


React.useEffect(() => {
  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      setLoadingUser(false); // ✅ <-- Mark user loading as done even if user is null
      return;
    }

    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching onboarding data:", error);
    }

    if (data) {
      setFitnessPlan(data.fitness_plan || null);
      setSetupFinished(data.setupFinished || false);
    }

    setLoading(false);
    setLoadingUser(false); // ✅ <-- Mark loadingUser as done
  };

  fetchUserData();
}, [user]);



if (loadingUser) return <div>Loading...</div>;

if (!userProfile) return <div>Something went wrong</div>;



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
