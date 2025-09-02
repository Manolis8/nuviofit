import { ArrowLeft} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react";
import React, { useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useContext } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { generateFitnessPlan } from "@/components/lib/generateFitnessPlan";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/components/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"
import { markQuizCompleted } from "@/components/lib/markQuizCompleted";

export default function OnboardingPage() {
      const { getClient } = useSupabaseClientWithAuth();
          const [quizCompleted, setQuizCompleted] = useState<boolean | null>(null);
  const [step, setStep] = useState(0)
  const totalSteps = 18
  const totalQuestionSteps = 15;
  const isProgressStep = step > 0 && step < 17 && step !== 8;
  const questionStepIndex = step < 8 ? step : step - 1;
  const progress = (questionStepIndex / totalQuestionSteps) * 100;
const [isDataSaved, setIsDataSaved] = useState(false);
  const { user, isLoaded } = useUser();
      const [email, setEmail] = useState("");
        const [username, setUsername] = useState("");
          const navigate = useNavigate();
            const [planGenerated, setPlanGenerated] = useState(false);
  const [plan, setPlan] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
const [loadingS, setLoadingS] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
const {
  setupFinished,
  setSetupFinished,
  userProfile,
  setUserProfile,
  loading
} = useUserContext();
const [usernameError, setUsernameError] = useState("");
  const [formData, setFormData] = useState({
  achievements: "",
  workoutHistory: "",
  fitnessWhy: [] as string[],
  otherWhy: "",
  futureVision: "",
  resilienceTrigger: "",
  pushingComfort: "",
  consistencyBlocker: "",
  customBlocker: "",
  supportSystem: "",
  customSupport: "",
  WhatToImprove: [] as string[],
  TrainingMethod: [] as string[],
  TrainingFrequency: "",
  TrainingDuration: "",
  WorkoutLevel: "",
  injuries: "",
  recommedations: "",
  fitnessPlans: "",
  username: "",
  email: "",  
});

// 🚫 Warn on tab close / refresh for step 17
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isGenerating && step === 17) {
      e.preventDefault();
      e.returnValue =
        "⚠️ Plan generation is in progress. Leaving now may disrupt the process. Please wait until it completes.";
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [isGenerating, step]);

// 🚫 Block in-app navigation for step 17
const handleNavigate = (to: string) => {
  if (isGenerating && step === 17) {
    const confirmLeave = window.confirm(
      "⚠️ Plan generation is in progress. Leaving now may disrupt the process. Please wait until it completes."
    );
    if (!confirmLeave) return; // User chose "Cancel"
  }
  navigate(to);
};



  useEffect(() => {
    async function fetchEmail() {
      if (!user) return;
      setEmail(user.emailAddresses[0]?.emailAddress || "");
    }

    fetchEmail();
  }, [user]);


  useEffect(() => {
    if (!user) return;

    const fetchOnboarding = async () => {
      try {
        // ✅ Explicitly type the Supabase client
        const supabase: SupabaseClient = await getClient();

        const { data, error } = await supabase
          .from("onboarding_responses")
          .select("quiz_completed")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data) {
          setQuizCompleted(data.quiz_completed);

          // Redirect immediately if quiz already completed
          if (data.quiz_completed) {
            navigate("/dashboard", { replace: true });
          }
        } else {
          console.error("Failed to fetch onboarding data:", error);
          setQuizCompleted(false);
        }
      } catch (err) {
        console.error("Unexpected error fetching onboarding data:", err);
        setQuizCompleted(false);
      }
    };

    fetchOnboarding();
  }, [user, navigate, getClient]);



useEffect(() => {
  if (user) {
    // Set email and optionally username on formData once user loads
    setFormData((prev) => ({
      ...prev,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      username: prev.username || "", // or fetch from Supabase separately if you want
    }));
  }
}, [user]);



if (!isLoaded) return <div>Loading...</div>;


const generatePlan = async () => {
  const user_id = user?.id;
  if (!user_id || planGenerated || step !== 17) return;

  if (!isDataSaved) {
    alert("⚠️ Please save your data before generating the plan.");
    return;
  }

  setIsGenerating(true);

  try {
    const supabaseAuthClient = await getClient();

    // Fetch onboarding data
    const { data: onboardingData, error: fetchError } = await supabaseAuthClient
      .from("onboarding_responses")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ Supabase fetch error:", fetchError);
      alert("Failed to fetch your onboarding data.");
      return;
    }

    if (!onboardingData) {
      alert("❌ No saved data found. Please save your data first.");
      return;
    }

    // Generate the fitness plan
    const planResult = await generateFitnessPlan(supabaseAuthClient, user_id);

    if (!planResult) {
      alert("❌ Plan generation failed. Please try again.");
      return;
    }

    // Upsert the updated row
    const updatedRow = { ...onboardingData, fitness_plan: planResult };
    const { error: upsertError } = await supabaseAuthClient
      .from("onboarding_responses")
      .upsert(updatedRow, { onConflict: "user_id" });

    if (upsertError) {
      console.error("❌ Supabase upsert error:", upsertError);
      alert("Failed to save your fitness plan.");
      return;
    }

    // ✅ Mark quiz as completed
    await markQuizCompleted(supabaseAuthClient, user_id);

    setPlanGenerated(true);
    navigate("/dashboard"); // Redirect after success
  } catch (err: any) {
    console.error("❌ Failed to generate plan:", err);
    alert("Failed to generate plan: " + (err.message || err));
  } finally {
    setIsGenerating(false);
  }
};


const nextStep = async () => {
  if (step < totalSteps - 1) {
    setStep(step + 1);
  } else if (step === totalSteps - 1) {
  }
};


useEffect(() => {
  if (setupFinished) {
    navigate("/dashboard", { replace: true });
  }
}, [setupFinished]);



const handleSubmit = async () => {
  const user_id = user.id;

  const safe = (val) => {
    if (Array.isArray(val)) return val.length ? val.join(", ") : "nothing";
    return val?.trim?.() || "nothing";
  };

  // Ensure email is set here:
  const emailToSave = user.emailAddresses?.[0]?.emailAddress || formData.email;
const supabaseAuthClient = await getClient();
  const { data, error } = await supabaseAuthClient
    .from("onboarding_responses")
    .upsert(
      [
        {
          user_id,
          username: safe(formData.username),
          achievements: safe(formData.achievements),
          workout_history: safe(formData.workoutHistory),
          fitness_why: safe(formData.fitnessWhy),
          other_why: safe(formData.otherWhy),
          future_vision: safe(formData.futureVision),
          resilience_trigger: safe(formData.resilienceTrigger),
          pushing_comfort: safe(formData.pushingComfort),
          consistency_blocker: safe(formData.consistencyBlocker),
          custom_blocker: safe(formData.customBlocker),
          support_system: safe(formData.supportSystem),
          custom_support: safe(formData.customSupport),
          what_to_imporve: safe(formData.WhatToImprove),
          training_method: safe(formData.TrainingMethod),
          training_frequency: safe(formData.TrainingFrequency),
          training_duration: safe(formData.TrainingDuration),
          workout_level: safe(formData.WorkoutLevel),
          injuries: safe(formData.injuries),
          recommedations: safe(formData.recommedations),
          email: safe(emailToSave),
          // fitness_plan excluded as you said
        },
      ],
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("❌ Supabase upsert error:", error);
    return false;
  }

  return true;
};

   


  const handleChange = (field: string, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};


const sendWelcomeEmail = async (email: string, username: string) => {
  console.log("📤 Sending welcome email to", email);

  try {
    const res = await fetch("/api/sendwelcomeEmails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username }),
    });

    const data = await res.json();
    console.log("📨 Brevo response:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email");
    }
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};


const handleSaveData = async () => {
  const user_id = user.id;

  if (!user_id) {
    alert("❌ No user ID found.");
    return;
  }

  const success = await handleSubmit();

  if (!success) {
    alert("❌ Failed to save data");
    return;
  }

  // ✅ Only call this when we know the data is saved and formData has email/username
  
  setIsDataSaved(true);
  nextStep();
};

  const handleClick = async () => {
await generatePlan();
    await sendWelcomeEmail(formData.email, formData.username);
  };



  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const isCurrentStepValid = () => {
  if (step === 1) return formData.workoutHistory !== "";

  if (step === 2) {
    const selected = formData.fitnessWhy;
    const pickedOther = selected.includes("other");
    const typedOther = formData.otherWhy?.trim().length > 0;
    return selected.length > 0 && (!pickedOther || typedOther);
  }

  if (step === 3) return formData.futureVision !== "";

  if (step === 4) return formData.resilienceTrigger !== "";

  if (step === 5) return formData.pushingComfort !== "";

  if (step === 6) {
    const selected = formData.consistencyBlocker;
    const pickedOther = selected === "other";
    const typedOther = formData.customBlocker?.trim().length > 0;
    return selected !== "" && (!pickedOther || typedOther);
  }

  if (step === 7) {
    const selected = formData.supportSystem;
    const pickedOther = selected === "other";
    const typedOther = formData.customSupport?.trim().length > 0;
    return selected !== "" && (!pickedOther || typedOther);
  }

  if (step === 9) return formData.WhatToImprove?.length > 0;

  if (step === 10) return formData.TrainingMethod?.length > 0;
  
  if (step === 11) return formData.TrainingFrequency !== "";

  if (step === 12) return formData.TrainingDuration !== "";

  if (step === 13) return formData.WorkoutLevel !== "";

  if (step === 14) {
    return formData.injuries?.trim().length > 0;
  }

  if (step === 15) {
    return formData.achievements?.trim().length > 0;
  }

   if (step === 16) {
    return formData.recommedations?.trim().length > 0;
  }
if (step === 0) {
  const len = formData.username.trim().length;
  return len > 4 
}

  return true;
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f8ff] to-[#f8faff]">
      <header className="container mx-auto flex h-20 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA]">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
              <path
                d="M12 2L14.4 7.2L20 8.4L16 12.4L17.2 18L12 15.2L6.8 18L8 12.4L4 8.4L9.6 7.2L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900">Nuviofit</span>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA] bg-clip-text text-3xl font-bold text-transparent">
              Let's Personalize Your Experience
            </h1>
            <p className="text-slate-600">Help us understand your goals so we can create the perfect plan for you.</p>
          </div>

          {isProgressStep && (
  <div className="mb-8">
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <motion.div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA]"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
    <div className="mt-2 flex justify-between text-sm text-slate-500">
      <span>
        Step {questionStepIndex} of {totalQuestionSteps}
      </span>
      <span>{Math.round(progress)}% Complete</span>
    </div>
  </div>
)}


          {/* Step Content */}
          <Card className="overflow-hidden border-none bg-white/90 shadow-xl backdrop-blur-sm">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[300px]"
                >

{step === 0 && (
  <div className="text-center">
    <h2 className="mb-4 text-3xl font-bold text-slate-900">Welcome to Nuviofit! 🎉</h2>
    <p className="text-slate-600 mb-6">
      You're one step away from joining a powerful fitness movement. Let’s build your plan together!
    </p>

    <Input
      type="text"
      maxLength={30}
      value={formData.username}
      onChange={(e) => {
        const value = e.target.value;
        handleChange("username", value);

        if (value.trim().length < 4) {
          setUsernameError("Username must be at least 4 characters.");
        } else {
          setUsernameError("");
        }
      }}
      placeholder="Enter username"
    />
    
    {/* Show character limit info */}
    <p className="text-sm text-gray-500 mt-1">Max username length: 30 characters</p>

    {/* Show error if exists */}
    {usernameError && (
      <p className="text-sm text-red-600 mt-1">{usernameError}</p>
    )}

    <br />

    {/* Button disabled if username is invalid */}
    <Button
      onClick={nextStep}
      disabled={
        formData.username.trim().length < 4 ||
        formData.username.trim().length > 30 ||
        usernameError !== ""
      }
      className="bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA] text-white px-6 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Let’s Get Started →
    </Button>
  </div>
)}




                 {step === 1 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      Have you tried working out before?
    </h2>

    <RadioGroup
      value={formData.workoutHistory}
      onValueChange={(value) => handleChange("workoutHistory", value)}
      className="space-y-4"
    >
      {[
        { value: "No, I’m just starting out", label: "No, I’m just starting out", emoji: "🆕" },
        { value: "I’ve tried a few times, didn’t stick", label: "I’ve tried a few times, didn’t stick", emoji: "🏃" },
        { value: "I’ve trained on and off", label: "I’ve trained on and off", emoji: "🔁" },
        { value: "Yes, I followed a full plan before(committed)", label: "Yes, I followed a full plan before", emoji: "💪" },
      ].map((item) => {
        const isSelected = formData.workoutHistory === item.value;
        return (
          <div
            key={item.value}
            onClick={() => handleChange("workoutHistory", item.value)}
            className={`relative flex cursor-pointer items-start rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : ""
            }`}
          >
            <RadioGroupItem
              value={item.value}
              id={item.value}
              className="mt-1"
            />
            <Label htmlFor={item.value} className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  </div>
)}
           {step === 2 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      What’s your “why”? <br />
      <span className="text-base font-normal text-slate-600">
        What is your #1 reason for starting a fitness journey?(Pick all that apply)
      </span>
    </h2>

    <div className="space-y-4">
      {[
        { value: "Family & role model", label: "Family & role model", emoji: "👪" },
        { value: "Mental strength / clarity", label: "Mental strength / clarity", emoji: "🧠" },
        { value: "Self-respect & confidence", label: "Self-respect & confidence", emoji: "💼" },
        { value: "Prove something to myself", label: "Prove something to myself", emoji: "⚔️" },
        { value: "Challenge & growth", label: "Challenge & growth", emoji: "🧗‍♂️" },
        { value: "other", label: "Other", emoji: "✍️" },
      ].map((item) => {
        const isSelected = formData.fitnessWhy.includes(item.value);
        const toggleSelection = () => {
          const updated = isSelected
            ? formData.fitnessWhy.filter((v) => v !== item.value)
            : [...formData.fitnessWhy, item.value];
          setFormData((prev) => ({ ...prev, fitnessWhy: updated }));
        };

        return (
          <div
            key={item.value}
            onClick={toggleSelection}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="mt-1 accent-[#56A7F2]"
            />
            <Label className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </div>

    {formData.fitnessWhy.includes("other") && (
      <div className="mt-4">
        <label htmlFor="otherWhy" className="block text-sm font-medium text-slate-700">
          Tell us your reason:
        </label>
        <input
          type="text"
          id="otherWhy"
          name="otherWhy"
          value={formData.otherWhy}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, otherWhy: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-[#56A7F2] focus:ring-[#56A7F2]"
          placeholder="Your unique reason..."
        />
      </div>
    )}
  </div>
)}
                  {step === 3 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      Where do you see yourself in 6 months?
      <br />
      <span className="text-base font-normal text-slate-600">
        After using our fitness program, what do you hope to accomplish?
      </span>
    </h2>

    <RadioGroup
      value={formData.futureVision}
      onValueChange={(value) => handleChange("futureVision", value)}
      className="space-y-4"
    >
      {[
        { value: "Look and feel more confident", label: "Look and feel more confident", emoji: "🔥" },
        { value: "Be stronger and more athletic", label: "Be stronger and more athletic", emoji: "💪" },
        { value: "Lose weight and be leaner", label: "Lose weight and be leaner", emoji: "⚖️" },
        { value: "Improve my overall health", label: "Improve my overall health", emoji: "❤️" },
        { value: "Stick to a consistent routine", label: "Stick to a consistent routine", emoji: "📅" },
      ].map((item) => {
        const isSelected = formData.futureVision === item.value;
        return (
          <div
            key={item.value}
            onClick={() => handleChange("futureVision", item.value)}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <RadioGroupItem value={item.value} id={item.value} />
            <Label htmlFor={item.value} className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  </div>
)}


                  {step === 4 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      What keeps you going when things get hard?
      <br />
      <span className="text-base font-normal text-slate-600">
        What drives you to keep pushing through challenges?
      </span>
    </h2>

    <RadioGroup
      value={formData.resilienceTrigger}
      onValueChange={(value) => handleChange("resilienceTrigger", value)}
      className="space-y-4"
    >
      {[
        { value: "My family or people I care about", label: "My family or people I care about", emoji: "👨‍👩‍👧‍👦" },
        { value: "The person I want to become", label: "The person I want to become", emoji: "🧠" },
        { value: "Proving people wrong", label: "Proving people wrong", emoji: "⚔️" },
        { value: "Leaving a legacy", label: "Leaving a legacy", emoji: "🏆" },       
        { value: "I made a promise to myself", label: "I made a promise to myself", emoji: "🧱" },
        { value: "I give-up", label: "I usually give up", emoji: "😞" },
      ].map((item) => {
        const isSelected = formData.resilienceTrigger === item.value;
        return (
          <div
            key={item.value}
            onClick={() => handleChange("resilienceTrigger", item.value)}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <RadioGroupItem value={item.value} id={item.value} />
            <Label htmlFor={item.value} className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  </div>
)}
                  {step === 5 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      Do you enjoy pushing yourself physically?
      <br />
      <span className="text-base font-normal text-slate-600">
        How do you feel about tough workouts and physical effort?
      </span>
    </h2>

    <RadioGroup
      value={formData.pushingComfort}
      onValueChange={(value) => handleChange("pushingComfort", value)}
      className="space-y-4"
    >
      {[
        { value: "Yes, I love pushing my limits", label: "Yes, I love pushing my limits", emoji: "🔥" },
        { value: "I don’t love it, but I can do it", label: "I don’t love it, but I can do it", emoji: "😤" },
        { value: "Not really, I prefer easier sessions", label: "Not really, I prefer easier sessions", emoji: "😅" },
        { value: "No, I avoid discomfort", label: "No, I avoid discomfort", emoji: "🚫" },
      ].map((item) => {
        const isSelected = formData.pushingComfort === item.value;
        return (
          <div
            key={item.value}
            onClick={() => handleChange("pushingComfort", item.value)}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <RadioGroupItem value={item.value} id={item.value} />
            <Label htmlFor={item.value} className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  </div>
)}

{step === 6 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      What usually stops you from staying consistent with fitness?
      <br />
      <span className="text-base font-normal text-slate-600">
        Choose what has blocked you the most in the past.
      </span>
    </h2>

    <RadioGroup
      value={formData.consistencyBlocker}
      onValueChange={(value) => handleChange("consistencyBlocker", value)}
      className="space-y-4"
    >
      {[
        { value: "Lack of time or busy schedule", label: "Lack of time or busy schedule", emoji: "⏰" },
        { value: "Low energy or burnout", label: "Low energy or burnout", emoji: "😩" },
        { value: "No clear routine or plan", label: "No clear routine or plan", emoji: "🗺️" },
        { value: "Not seeing progress fast enough", label: "Not seeing progress fast enough", emoji: "🐢" },
        { value: "Self-doubt or lack of confidence", label: "Self-doubt or lack of confidence", emoji: "🧠" },
        { value: "nothing", label: "Nothing", emoji: "💪" },
        { value: "other", label: "Other (let us know)", emoji: "📝" },
      ].map((item) => {
        const isSelected = formData.consistencyBlocker === item.value;
        return (
          <div
            key={item.value}
            onClick={() => handleChange("consistencyBlocker", item.value)}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <RadioGroupItem value={item.value} id={item.value} />
            <Label htmlFor={item.value} className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>

    {formData.consistencyBlocker === "other" && (
      <div className="mt-4">
        <label htmlFor="customBlocker" className="block text-sm font-medium text-slate-700">
          Share your reason:
        </label>
        <input
          type="text"
          id="customBlocker"
          name="customBlocker"
          value={formData.customBlocker || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customBlocker: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-[#56A7F2] focus:ring-[#56A7F2]"
          placeholder="Your personal blocker..."
        />
      </div>
    )}
  </div>
)}

{step === 7 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      Is anyone supporting your fitness journey right now?
      <br />
      <span className="text-base font-normal text-slate-600">
        Having a support system can be a huge factor in staying consistent.
      </span>
    </h2>

    <RadioGroup
      value={formData.supportSystem}
      onValueChange={(value) => handleChange("supportSystem", value)}
      className="space-y-4"
    >
      {[
        { value: "my family or partner", label: "Yes – my family or partner", emoji: "👨‍👩‍👧‍👦" },
        { value: "a friend or training buddy", label: "Yes – a friend or training buddy", emoji: "🧑‍🤝‍🧑" },
        { value: "a coach or mentor", label: "Yes – a coach or mentor", emoji: "🧑‍🏫" },
        { value: "no-one", label: "No, I’m doing it alone", emoji: "🙅" },
        { value: "other", label: "Other (please specify)", emoji: "✍️" },
      ].map((item) => {
        const isSelected = formData.supportSystem === item.value;
        return (
          <div
            key={item.value}
            onClick={() => handleChange("supportSystem", item.value)}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <RadioGroupItem value={item.value} id={item.value} />
            <Label htmlFor={item.value} className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>

    {formData.supportSystem === "other" && (
      <div className="mt-4">
        <label htmlFor="customSupport" className="block text-sm font-medium text-slate-700">
          Tell us who:
        </label>
        <input
          type="text"
          id="customSupport"
          name="customSupport"
          value={formData.customSupport || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customSupport: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-[#56A7F2] focus:ring-[#56A7F2]"
          placeholder="Type here..."
        />
      </div>
    )}
  </div>
)}

{step === 8 && (
  <div className="text-center px-4 py-12">
    <h2 className="text-4xl font-bold bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA] bg-clip-text text-transparent mb-6">
      You're Halfway Through
    </h2>

    <p className="text-slate-700 text-lg mb-6">
  You’ve just worked through the questions most people avoid — the ones that challenge your mindset, not just your muscles.
</p>

<p className="text-slate-600 italic mb-4">
  These weren’t just forms. They were reflections.
</p>

<p className="text-[#4ECDC4] font-semibold mb-8">
  Most stop here. But you didn’t. That’s the difference.
</p>

    <p className="text-slate-600 italic mb-4">
      Most give up before this point. But you're still here.
    </p>

    <p className="text-[#4ECDC4] font-semibold mb-8">
      That says everything about the kind of person you're becoming.
    </p>
  </div>
)}

{step === 9 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      What do you want to improve? <br />
      <span className="text-base font-normal text-slate-600">
        Pick the areas where you'd like to see progress or focus your effort.
(Select all that apply)
      </span>
    </h2>

    <div className="space-y-4">
      {[
        { value: "Strength", label: "Strength — Build muscle & power", emoji: "💪" },
{ value: "Endurance", label: "Endurance — Boost stamina & cardio", emoji: "🏃" },
{ value: "Flexibility", label: "Flexibility — Improve joint mobility", emoji: "🧘" },
{ value: "Core & Balance", label: "Core & Balance — Enhance posture & control", emoji: "⚖️" },
{ value: "Weight Loss", label: "Weight Loss — Burn fat & get active", emoji: "🔥" },
{ value: "Speed & Agility", label: "Speed & Agility — Move faster & react", emoji: "⚡" },
{ value: "Recovery & Rehab", label: "Recovery & Rehab — Heal gently & safely", emoji: "🩹" },
{ value: "General Fitness-Stay active & healthy", label: "General Fitness — Stay active & healthy", emoji: "🧠" },
      ].map((item) => {
        const isSelected = formData.WhatToImprove.includes(item.value);
        const toggleSelection = () => {
          const updated = isSelected
            ? formData.WhatToImprove.filter((v) => v !== item.value)
            : [...formData.WhatToImprove, item.value];
          setFormData((prev) => ({ ...prev, WhatToImprove: updated }));
        };

        return (
          <div
            key={item.value}
            onClick={toggleSelection}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="mt-1 accent-[#56A7F2]"
            />
            <Label className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </div>
  </div>
)}

{step === 10 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      How do you want to train or stay active? <br />
      <span className="text-base font-normal text-slate-600">
        Pick what you enjoy or want to try.
      </span>
    </h2>

    <div className="space-y-4">
      {[
  { value: "Gym workouts", label: "Gym workouts — Machines, weights", emoji: "🏋" },
  { value: "Bodyweight / Calisthenics", label: "Bodyweight / Calisthenics — Little equipment, at-home", emoji: "🤸" },
  { value: "Running / Jogging", label: "Running / Jogging — Cardio / solo", emoji: "🏃" },
  { value: "Biking", label: "Biking — Cardio", emoji: "🚴" },
  { value: "Yoga / Pilates", label: "Yoga / Pilates — Mobility, calm", emoji: "🧘" },
  { value: "Walking ", label: "Walking — Natural terrain, relaxing", emoji: "🥾" },
  { value: "Swimming", label: "Swimming — Low impact, full body", emoji: "🏊" },
  { value: "Rehab / Therapy", label: "Rehab / Therapy — Recovery movements", emoji: "🩺" },
      ].map((item) => {
        const isSelected = formData.TrainingMethod.includes(item.value);
        const toggleSelection = () => {
          const updated = isSelected
            ? formData.TrainingMethod.filter((v) => v !== item.value)
            : [...formData.TrainingMethod, item.value];
          setFormData((prev) => ({ ...prev, TrainingMethod: updated }));
        };

        return (
          <div
            key={item.value}
            onClick={toggleSelection}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="mt-1 accent-[#56A7F2]"
            />
            <Label className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </Label>
          </div>
        );
      })}
    </div>
  </div>
)}

{step === 11 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      How many times per week are you willing to train? <br />
      <span className="text-base font-normal text-slate-600">
        Choose traning frequency
      </span>
    </h2>

    <div className="space-y-4">
      {[
        { value: "1–2x per week", label: "1–2x per week — Low commitment", emoji: "🚶" },
        { value: "3–4x per week", label: "3–4x per week — Moderate commitment", emoji: "🏃" },
        { value: "5-6x per week", label: "5-6x per week — High commitment", emoji: "💪" },
        { value: "7x per week", label: "7x per week - Intense commitment", emoji: "🔥" },
      ].map((item) => {
        const isSelected = formData.TrainingFrequency === item.value;
        const selectOption = () => {
          setFormData((prev) => ({
            ...prev,
            TrainingFrequency: item.value,
          }));
        };

        return (
          <div
            key={item.value}
            onClick={selectOption}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <input
              type="radio"
              checked={isSelected}
              readOnly
              className="mt-1 accent-[#56A7F2]"
            />
            <label className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </label>
          </div>
        );
      })}
    </div>
  </div>
)}

{step === 12 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      How much time can you commit to each workout? <br />
      <span className="text-base font-normal text-slate-600">
        Choose training duration!
      </span>
    </h2>

    <div className="space-y-4">
      {[
       { value: "15–30 minutes", label: "15–30 minutes", emoji: "🧘" },   
{ value: "30–60 minutes", label: "30–60 minutes", emoji: "🚴" },   
{ value: "1-1.5 hours", label: "1-1.5 hours", emoji: "🏋️" },       
{ value: "over 1.5 hours", label: "1.5+ hours", emoji: "⚡" }     
      ].map((item) => {
        const isSelected = formData.TrainingDuration === item.value;
        const selectOption = () => {
          setFormData((prev) => ({
            ...prev,
            TrainingDuration: item.value,
          }));
        };

        return (
          <div
            key={item.value}
            onClick={selectOption}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <input
              type="radio"
              checked={isSelected}
              readOnly
              className="mt-1 accent-[#56A7F2]"
            />
            <label className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </label>
          </div>
        );
      })}
    </div>
  </div>
)}

{step === 13 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      What level do you think you are? <br />
      <span className="text-base font-normal text-slate-600">
        Choose a level!
      </span>
    </h2>

    <div className="space-y-4">
      {[
{ value: "beginner", label: "Beginner", emoji: "🌱" },  
{ value: "Intermidiate", label: "Intermidiate", emoji: "🔥" },   
{ value: "Advanced", label: "Advanced", emoji: "🚀" },  
{ value: "Elite", label: "Elite", emoji: "🦾" }               
      ].map((item) => {
        const isSelected = formData.WorkoutLevel === item.value;
        const selectOption = () => {
          setFormData((prev) => ({
            ...prev,
            WorkoutLevel: item.value,
          }));
        };

        return (
          <div
            key={item.value}
            onClick={selectOption}
            className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all duration-200 hover:border-[#56A7F2] ${
              isSelected ? "border-[#56A7F2] bg-[#f0f8ff]" : "border-slate-200"
            }`}
          >
            <input
              type="radio"
              checked={isSelected}
              readOnly
              className="mt-1 accent-[#56A7F2]"
            />
            <label className="ml-2 flex items-center font-medium cursor-pointer">
              <span className="mr-2">{item.emoji}</span>
              {item.label}
            </label>
          </div>
        );
      })}
    </div>
  </div>
)}

{step === 14 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      Do you have any injuries or limitations?
      <br />
      <span className="text-base font-normal text-slate-600">
        This helps us design a safe and effective program. List anything you'd like us to consider.
      </span>
    </h2>

   <textarea
      placeholder="e.g. Lower back pain, knee injury in 2022, recovering from surgery, asthma, or say no injurie"
      className="w-full border border-slate-300 rounded-md p-3 h-32 text-sm focus:ring-2 focus:ring-[#56A7F2] focus:outline-none"
      value={formData.injuries || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          injuries: e.target.value,
        }))
      }
    />

  </div>
)}


{step === 15 && (
  <div>
    <h2 className="mb-6 text-2xl font-medium text-slate-900">
      List your notable achievements
      <br />
      <span className="text-base font-normal text-slate-600">
        These will help us tailor your fitness program. Include any relevant milestones, challenges, or progress you've made.
      </span>
    </h2>

    <textarea
      placeholder="e.g. Completed a 10k run, lost 15kg, overcame knee pain, trained 6x/week for 3 months or say nothing"
      className="w-full border border-slate-300 rounded-md p-3 h-32 text-sm focus:ring-2 focus:ring-[#56A7F2] focus:outline-none"
      value={formData.achievements || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          achievements: e.target.value,
        }))
      }
    />
  </div>
)}

{step === 16 && (
  <div className="mt-4">
    <label htmlFor="recommedations" className="block text-sm font-medium text-slate-700 mb-2">
      Anything else you'd like us to know?
      <span className="block text-sm text-slate-500 mt-1">
        Let us know any special preferences, restrictions, or training styles you want us to consider or say nothing.
      </span>
    </label>
    <textarea
      id="recommedations"
      name="recommedations"
      value={formData.recommedations || ""}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, recommedations: e.target.value }))
      }
      className="block w-full rounded-md border border-slate-300 p-3 shadow-sm focus:border-[#56A7F2] focus:ring-[#56A7F2] text-slate-800"
      placeholder="e.g. I don’t want to train legs, focus on arms, prefer bodyweight workouts, no early mornings..."
      rows={4}
    />
  </div>
)}



{step === 17 && (
  <div className="text-center">
    <h2 className="mb-4 text-3xl font-bold text-slate-900">
      🎉 You’ve Completed the Onboarding!
    </h2>

    <p className="text-slate-600 mb-4">
      Welcome to the <span className="font-semibold text-[#56A7F2]">Nuviofit</span> family.
    </p>

    <p className="text-slate-500 italic mb-6">
      Based on your answers, we’re about to generate a personalized fitness plan just for you. Tap the button below to get started!
    </p>

    {/* 🌀 Show loading state while generating plan */}
    {isGenerating && (
      <div className="flex items-center justify-center gap-2 text-slate-500 italic mb-4">
        <span className="animate-spin text-xl">⏳</span>
        Generating your personalized plan...
      </div>
    )}

    {/* 📄 Display plan content */}
    <div className="text-left bg-white border border-slate-300 rounded-lg p-4 shadow-sm whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto mb-6">
      {plan
        ? plan
        : "Tap the 'Generate My Plan' button below to create your personalized program."}
    </div>

    {/* 🎯 Buttons */}
    <div className="mt-6 flex flex-col gap-4 items-center">
<Button
  onClick={handleClick}
  disabled={isGenerating}
  className="bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA] text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all w-full max-w-xs"
>
  {isGenerating
    ? "Generating..."
    : isCompleted
    ? "Plan Completed ✅"
    : "Generate My Plan"}
</Button>


    </div>
  </div>
)}

                </motion.div>
              </AnimatePresence>

             {![0, 17].includes(step) && (
  <div className="mt-10 flex justify-between">
    <Button
      variant="outline"
      onClick={prevStep}
      className="flex items-center gap-2 border-slate-200 px-5"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>

    {step === 16 ? (
<Button
      onClick={handleSaveData}
      disabled={loadingS || !isCurrentStepValid()}
      className="group relative overflow-hidden bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA] px-5 text-white transition-all duration-300 hover:shadow-md disabled:opacity-60"
    >
      <span className="relative z-10 flex items-center gap-2">
        {loadingS ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            Save Data & Continue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </span>
      <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-[#3db9b1] via-[#4a91d8] to-[#8a6ad0] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"></span>
    </Button>

    ) : (
      <Button
        onClick={nextStep}
        disabled={!isCurrentStepValid()}
        className="group relative overflow-hidden bg-gradient-to-r from-[#4ECDC4] via-[#56A7F2] to-[#9F7AEA] px-5 text-white transition-all duration-300 hover:shadow-md"
      >
        <span className="relative z-10 flex items-center gap-2">
          Next
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
        <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-[#3db9b1] via-[#4a91d8] to-[#8a6ad0] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"></span>
      </Button>
    )}
  </div>
)}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
