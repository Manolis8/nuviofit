import React, { createContext, useContext, useState, ReactNode } from "react";
import { Exercise } from "@/components/lib/frontendOpenai";
import { supabase } from "@/components/lib/supabaseClient";
import { useUser } from "@clerk/clerk-react";


type Goal = {
  id: string;
  text: string;
  isCompleted: boolean;
  category: "fitness" | "nutrition" | "mindfulness" | "other";
  createdAt: Date;
};

type FitnessLevel = "beginner" | "intermediate" | "advanced";

type FitnessGoal = "lose_weight" | "build_muscle" | "improve_endurance" | "general_fitness";

type DietaryPreference = "none" | "vegetarian" | "vegan" | "keto" | "paleo" | "gluten_free";

export interface UserProfile {
  fitnessLevel: FitnessLevel;
  fitnessGoal: FitnessGoal;
  fitnessFrequency: number;
  preferredActivities?: string[];
  trainingEnvironment?: "home" | "gym" | "outdoors" | "hybrid";
  availableEquipment?: "none" | "minimal" | "moderate" | "full";
  timePerWorkout?: number;
  name: string;
  fitnessInjuries?: string;
  dietaryPreference: DietaryPreference;
  additionalNotes?: string;
  email: string;
  workoutStyle?: "traditional" | "circuit" | "hiit" | "split" | "full_body";
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

type NutritionPlan = {
  meals: Array<{
    name: string;
    type: "breakfast" | "lunch" | "dinner" | "snack";
    description?: string;
    ingredients?: string[];
    macros?: {
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  }>;
  dailyCalories?: number;
  createdAt: Date;
  recommendations?: string[];
};

type UserContextType = {
  goals: Goal[];
  addGoal: (text: string, category: Goal["category"]) => void;
  toggleGoalCompletion: (id: string) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  fitnessPlan: FitnessPlan | null;
  isOnboardingComplete: boolean;
  loading: boolean;
  loadingUser: boolean;
  setFitnessPlan: (plan: FitnessPlan) => void;
  nutritionPlan: NutritionPlan | null;
  setNutritionPlan: (plan: NutritionPlan) => void;
  workoutNotes: WorkoutNote[];
  addWorkoutNote: (exerciseId: string, note: string) => void;
  hasCustomPlan: boolean;
  setHasCustomPlan: (value: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  deleteAccount: () => void;
  setupFinished: boolean;
  setSetupFinished: (value: boolean) => void;

};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState<WorkoutNote[]>([]);
  const [hasCustomPlan, setHasCustomPlan] = useState<boolean>(false);
  const isOnboardingComplete = !!userProfile && hasCustomPlan;
  const [loading, setLoading] = useState(true);
const [setupFinished, setSetupFinished] = useState(false);
const [loadingUser, setLoadingUser] = useState(true); // ✅ add this

  const { user } = useUser();



React.useEffect(() => {
  const fetchUserData = async () => {
if (!user) return;
const userId = user.id;

const { data, error } = await supabase
  .from("onboarding_responses")
  .select("*")
  .eq("user_id", userId)
  .maybeSingle();


    if (error) {
      console.error("Error fetching onboarding data:", error);
      return;
    }

    if (data) {
      setFitnessPlan(data.fitness_plan || null);
      setSetupFinished(data.setupFinished || false);
    }

    setLoading(false);
  };

  if (user) {
    fetchUserData();
  }
}, [user]);



  const addGoal = (text: string, category: Goal["category"]) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      text,
      isCompleted: false,
      category,
      createdAt: new Date(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    
    // In a real app, we'd save this to Supabase here
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, isCompleted: !goal.isCompleted } : goal
      )
    );
    
    // In a real app, we'd update this in Supabase here
  };

  const addWorkoutNote = (exerciseId: string, note: string) => {
    const newNote: WorkoutNote = {
      exerciseId,
      note,
      createdAt: new Date(),
    };
    setWorkoutNotes((prev) => [...prev, newNote]);
    
    // In a real app, we'd save this to Supabase here
  };

    const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  
  const logout = () => {
    setUserProfile(null);
    setGoals([]);
    setFitnessPlan(null);
    setNutritionPlan(null);
    setWorkoutNotes([]);
    setHasCustomPlan(false);
    // Optional: clear any localStorage or Supabase session here
  };

  const deleteAccount = () => {
    logout();
    // Optional: call Supabase to delete user data
  };


return (
  <UserContext.Provider
    value={{
      updateProfile,
       loadingUser,
      logout,
      deleteAccount,
      goals,
      addGoal,
      toggleGoalCompletion,
      userProfile,
      setUserProfile,
      fitnessPlan,
      setFitnessPlan,
      nutritionPlan,
      setNutritionPlan,
      workoutNotes,
      addWorkoutNote,
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
