import { useState } from "react"
import { Trophy, Target, Calendar, Users, Lock, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { ChefHat, Utensils, Apple } from "lucide-react"
import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react"; 
import { supabase } from "@/components/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";

export function GoalChallengeTracker() {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const { getToken } = useAuth(); // Clerk JWT
  const [showPopup, setShowPopup] = useState(false);
    const { user } = useUser();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      async function fetchUsername() {
        if (!user) return;
        setEmail(user.emailAddresses[0]?.emailAddress || "");
  
        const { data, error } = await supabase
          .from("onboarding_responses")
          .select("username")
          .eq("user_id", user.id)
          .single();
  
        if (error) {
          console.error("Error fetching username:", error.message);
        } else if (data?.username) {
          setUsername(data.username);
        }
      }
  
      fetchUsername();
    }, [user]);
  
    const waitlistOptions = [
      "Nutrition",
      "Meditation",
      "Goal Tracking",
      "Smartwatch Sync",
    ];
  
    const handleCheckboxChange = (option: string) => {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    };
  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setStatus(null);

  if (!user?.id) {
    setError("You must be logged in.");
    return;
  }

  if (selectedOptions.length === 0) {
    setError("Please select at least one option.");
    return;
  }

  try {
    // 1️⃣ Get Clerk token
    const token = await getToken({ template: "supabase" });

    // 2️⃣ Create authenticated Supabase client
    const supabaseClientWithAuth = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    setLoading(true);
    setStatus("Sending...");

    // 3️⃣ Fetch username from onboarding_responses
    const { data: onboardData, error: onboardError } = await supabaseClientWithAuth
      .from("onboarding_responses")
      .select("username")
      .eq("user_id", user.id)
      .single();

    if (onboardError) throw onboardError;

    const username = onboardData?.username || "unknown";
    const email = user.emailAddresses?.[0]?.emailAddress ?? "";

    // 4️⃣ Insert into waitlist_features using authenticated client
    const { error: insertError } = await supabaseClientWithAuth
      .from("waitlist_features")
      .insert([
        {
          user_id: user.id,
          email,
          username,
          nutrition: selectedOptions.includes("Nutrition"),
          meditation: selectedOptions.includes("Meditation"),
          goal_tracking: selectedOptions.includes("Goal Tracking"),
          smartwatch_sync: selectedOptions.includes("Smartwatch Sync"),
        },
      ]);

    if (insertError) {
      console.error(insertError);
      setError("Failed to join waitlist. Try again.");
      setStatus("Failed to send.");
    } else {
      setStatus("Success! We'll notify you.");
      setSelectedOptions([]);
      setTimeout(() => {
        setShowPopup(false);
        setStatus(null);
      }, 1500);
    }

  } catch (err) {
    console.error(err);
    setError("Authentication failed. Please refresh and try again.");
  } finally {
    setLoading(false);
  }
};



  return (
    <Card className="relative overflow-hidden">
  {/* Coming Soon Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
    <div className="text-center p-6">
      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">Coming Soon!</h3>
      <p className="text-gray-600 mb-4">Goals & Challenges feature is in development</p>
      <Button
        onClick={() => setShowPopup(true)}
        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600"
      >
        <Mail className="h-4 w-4 mr-2" />
        Join Beta Waitlist
      </Button>
    </div>
  </div>

  <CardHeader className="pb-3">
    <CardTitle className="flex items-center gap-2 text-lg">
      <Trophy className="h-5 w-5 text-yellow-500" />
      Goals & Challenges
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Current Goals */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Weekly Workout Goal</span>
        </div>
        <Badge variant="secondary">3/5</Badge>
      </div>
      <Progress value={60} className="h-2" />
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Daily Steps</span>
        </div>
        <Badge variant="secondary">8.2k/10k</Badge>
      </div>
      <Progress value={82} className="h-2" />
    </div>

    {/* Active Challenges */}
    <div className="pt-2 border-t">
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Users className="h-4 w-4 text-purple-500" />
        Active Challenges
      </h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
          <span className="text-sm">30-Day Consistency</span>
          <Badge variant="outline">Day 12</Badge>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
          <span className="text-sm">Summer Shred</span>
          <Badge variant="outline">Week 2</Badge>
        </div>
      </div>
    </div>


    {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Join the Waitlist</h3>
                    <p className="text-gray-600 mb-4">
                      Choose which features you look forward launching!
                    </p>
        
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                      <div className="flex flex-col gap-3">
                        {waitlistOptions.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`option-${idx}`}
                              checked={selectedOptions.includes(option)}
                              onChange={() => handleCheckboxChange(option)}
                            />
                            <label htmlFor={`option-${idx}`}>{option}</label>
                          </div>
                        ))}
                      </div>
        
                      <div className="flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-black text-white rounded p-2"
                        >
                          {loading ? "Joining..." : "Join Waitlist"}
                        </button>
        
                        <button
                          type="button"
                          onClick={() => setShowPopup(false)}
                          className="border rounded p-2"
                        >
                          Cancel
                        </button>
                      </div>
        
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      {status && <p className="text-sm text-center mt-2">{status}</p>}
                    </form>
                  </div>
                </div>
              )}
  </CardContent>
  
</Card>

  )
}
