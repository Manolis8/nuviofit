import { Brain, Heart, Moon, Lock, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ChefHat, Utensils, Apple } from "lucide-react"
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; 
import { supabase } from "@/components/lib/supabaseClient";
import {  Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Target, TrendingUp, Award} from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Progress } from "@/components/ui/progress"
import {Coffee} from "lucide-react"

export function NutritionPlan() {

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
  
      setLoading(true);
      setStatus("Sending...");
  
      const { error } = await supabase.from("waitlist_features").insert([
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
  
      if (error) {
        console.error(error);
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
  
      setLoading(false);
    };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🥗 AI Nutrition Plan
          <Lock className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <CardDescription>Personalized meal plans and nutrition tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Locked Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">🥗 Nutrition plans are cooking...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">🔒 Coming soon</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Soon
          </Badge>
        </div>

        {/* Preview Features */}
        <div className="space-y-3 opacity-60">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Coming Soon:</h4>

          {/* Meal Planning */}
          <div className="grid gap-3">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Coffee className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Breakfast Plans</p>
                  <p className="text-xs text-gray-400">Personalized morning nutrition</p>
                </div>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Utensils className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Meal Prep Guides</p>
                  <p className="text-xs text-gray-400">Weekly prep instructions</p>
                </div>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Apple className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Macro Tracking</p>
                  <p className="text-xs text-gray-400">Protein, carbs, fats balance</p>
                </div>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Coffee className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Calories</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Apple className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Protein</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Utensils className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Meals</p>
            </div>
          </div>
        </div>

        {/* CTA */}
<Button onClick={() => setShowPopup(true)} className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white">
          <Bell className="h-4 w-4 mr-2" />🔔 Join Waitlist
        </Button>
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
