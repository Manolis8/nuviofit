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
import { Activity, Crown } from "lucide-react"
export function SmartwatchSync() {
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
          ⌚ Smartwatch Sync
          <Lock className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <CardDescription>Connect your wearable device to track steps, sleep, and more</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Locked Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Premium Feature</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">🔒 Locked - Coming with Pro Tier</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            2026
          </Badge>
        </div>

        {/* Preview Features */}
        <div className="space-y-3 opacity-60">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Coming Soon:</h4>

          {/* Device Options */}
          <div className="grid gap-2">
            {[
              { name: "Apple Watch", icon: "⌚", popular: true },
              { name: "Fitbit", icon: "📱", popular: true },
              { name: "Garmin", icon: "🏃", popular: false },
              { name: "Samsung Galaxy Watch", icon: "⌚", popular: false },
            ].map((device, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{device.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-500 dark:text-gray-400">{device.name}</p>
                    <p className="text-xs text-gray-400">{device.popular ? "Popular choice" : "Advanced features"}</p>
                  </div>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Heart className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Heart Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Activity className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Steps</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Moon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Sleep</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button onClick={() => setShowPopup(true)} className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white">
          <Crown className="h-4 w-4 mr-2" />
          Coming with Pro Tier in 2026
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
