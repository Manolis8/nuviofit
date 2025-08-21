import { User, Flame, Trophy, Calendar, Settings, Crown, Lock, Bell } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"
import { supabase } from "@/components/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";




const achievements = [
  { emoji: "🔥", title: "First Workout", unlocked: false },
  { emoji: "💪", title: "Week Warrior", unlocked: false },
  { emoji: "🏃‍♀️", title: "Cardio King", unlocked: false },
  { emoji: "🎯", title: "Goal Getter", unlocked: false },
  { emoji: "🏆", title: "Champion", unlocked: false },
  { emoji: "👑", title: "Fitness Royalty", unlocked: false },
]

interface FeedbackData {
  message: string;
}

export default function ProfilePage() {


  const { getToken } = useAuth(); // Clerk JWT
const { user } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    async function fetchUserData() {
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

    fetchUserData();
  }, [user]);

  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    const token = await getToken({ template: "supabase" });
    
    const supabaseClientWithAuth = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the Clerk token for RLS
          },
        },
      }
    );

    if (!user?.id) {
      setError("You must be logged in.");
      return;
    }

    if (!feedbackText.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }

const { error: insertError } = await supabaseClientWithAuth
  .from("feedback")
  .insert([
    {
      user_id: user.id,
      email,
      username,
      message: feedbackText,
    },
  ]);


    if (insertError) {
      console.error(insertError);
      setError("Failed to submit feedback.");
      setStatus("Error");
    } else {
      setStatus("Feedback submitted successfully!");
      setFeedbackText("");
    }
  };


// This function sends the feedback to Supabase.
async function sendFeedback(user: any, formData: FeedbackData) {
  if (!user?.id) throw new Error("User not logged in.");

  // 1️⃣ Get Clerk token
  const token = await getToken({ template: "supabase" });

  // 2️⃣ Create a Supabase client with auth headers
  const supabase = createClient(
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

  // 3️⃣ Fetch username (optional)
  const { data: onboardData, error: onboardError } = await supabase
    .from("onboarding_responses")
    .select("username")
    .eq("user_id", user.id)
    .single();

  if (onboardError) console.warn("Username fetch failed:", onboardError.message);

  const username = onboardData?.username || "Unknown";
  const email = user.emailAddresses?.[0]?.emailAddress ?? "";

  // 4️⃣ Insert feedback
  const { error: insertError } = await supabase.from("feedback").insert([
    {
      user_id: user.id,
      username,
      email,
      message: formData.message,
    },
  ]);

  if (insertError) {
    console.error("Failed to send feedback:", insertError.message);
    throw insertError;
  }

  return true;
}



  const [isOpen, setIsOpen] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
const [formData, setFormData] = useState({
  name: "",
  email: "",
  message: ""
});






  const [showPopup, setShowPopup] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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


  const navigate = useNavigate()
    const [displayName, setDisplayName] = useState(
   user?.username ||  "User"
);
  const isValidDisplayName = displayName.length >= 4 && displayName.length <= 30;

  const email2 = user?.primaryEmailAddress?.emailAddress || "Unknown";


useEffect(() => {
  const fetchUsername = async () => {
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
  };

  if (user?.id) fetchUsername();
}, [user]);


useEffect(() => {
  const fetchJoinDate = async () => {
    const { data, error } = await supabase
      .from('onboarding_responses')
      .select('created_at')
      .eq('user_id', user.id) // make sure you have the current user's ID
      .single();

    if (error) {
      console.error("Failed to fetch join date:", error);
      return;
    }

    const rawDate = data.created_at;

    const formatted = new Date(rawDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    setUserData((prev) => ({
      ...prev,
      joinDate: formatted,
    }));
  };

  if (user?.id) fetchJoinDate();
}, [user?.id]);
useEffect(() => {
  if (user) {
    setUserData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email2: user.primaryEmailAddress?.emailAddress || "",
    }));
  }
}, [user]);

  const [userData, setUserData] = useState({
      firstName: "",
      lastName: "",
      username: "",
      email2: "",
      phone: "",
      joinDate: "",
      lastLogin: "",
    })

  useEffect(() => {
    const fetchJoinDate = async () => {
      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('created_at')
        .eq('user_id', user.id) // make sure you have the current user's ID
        .single();
  
      if (error) {
        console.error("Failed to fetch join date:", error);
        return;
      }
  
      const rawDate = data.created_at;
  
      const formatted = new Date(rawDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
  
      setUserData((prev) => ({
        ...prev,
        joinDate: formatted,
      }));
    };
  
    if (user?.id) fetchJoinDate();
  }, [user?.id]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-emerald-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white text-2xl font-bold">
                      JD
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{username}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{userData.email2}</p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <Badge
                        variant="secondary"
                        className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
                      >
                        Member since {userData.joinDate}
                      </Badge>
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {[
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      label: "Total Workouts",
      locked: true,
    },
    {
      icon: <Flame className="h-6 w-6 text-red-500" />,
      label: "Calories Burned",
      locked: true,
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      label: "Longest Streak",
      locked: true,
    },
    {
      icon: <User className="h-6 w-6 text-emerald-500" />,
      label: "Fitness Level",
      locked: true,
    },
  ].map((stat, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
    >
      <Card className="border-none shadow-md bg-white/70 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            {stat.icon}
            {stat.locked && <Lock className="h-4 w-4 text-gray-400" />}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1"></p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>


          {/* Achievements */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.6 }}
>
  <Card className="border-none shadow-lg mb-8">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        🏆 Achievements
        <Lock className="h-4 w-4 text-gray-400" />
      </CardTitle>
      <CardDescription>Your fitness milestones and badges</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className={`text-center p-4 rounded-lg border transition-all bg-gray-50 dark:bg-gray-800 ${
              achievement.unlocked
                ? "border-gray-200 dark:border-gray-700"
                : "opacity-50 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="text-3xl mb-2">{achievement.emoji}</div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {achievement.title}
            </p>
            <Lock
              className={`h-3 w-3 mx-auto mt-1 transition-opacity ${
                achievement.unlocked ? "opacity-0" : "opacity-100 text-gray-400"
              }`}
            />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</motion.div>



          {/* Premium Features - Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-emerald-950/20 relative">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium Features</h2>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 mb-4">
                    🚧 Coming Soon
                  </Badge>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Advanced features are in development and will be available soon!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 opacity-60">
                  {[
                    { icon: "🎯", title: "Goals", desc: "Goal tracking" },
                    { icon: "🍽️", title: "Nutrition Plans", desc: "AI-powered meal planning" },
                    { icon: "⌚", title: "Smartwatch Sync", desc: "Connect all your devices" },
                  ].map((feature, index) => (
                    <div key={index} className="p-4 bg-white/60 rounded-lg backdrop-blur-sm relative">
                      <Lock className="absolute top-2 right-2 h-4 w-4 text-gray-400" />
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>

<Button disabled className="bg-gray-300 text-gray-500 px-8 py-3 text-lg cursor-not-allowed">
  🔒 Coming in 2026
</Button>

<Button onClick={() => setShowPopup(true)} className="w-full mt-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white">
  🔔 Join Waitlist
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


              {showFeedback && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-bold mb-4">Send Feedback</h3>
      <p className="text-gray-600 mb-4">Help us improve your experience!</p>

      <div className="space-y-3">

        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Help us improve! Share ideas, feedback, or report a problem..."
          className="w-full p-3 border rounded-lg h-24 resize-none"
        />

        <div className="flex gap-2">
<Button
  onClick={async () => {
    if (!user) {
      alert("You must be signed in to send feedback.");
      return;
    }

    setStatus("Sending...");
    try {
      await sendFeedback(user, { message: formData.message });
      setStatus("Feedback sent!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => {
        setShowFeedback(false);
        setStatus(null);
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus("Failed to send.");
    }
  }}
  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-200"
>
  Send Feedback
</Button>



          <Button variant="outline" onClick={() => setShowFeedback(false)}>
            Cancel
          </Button>
        </div>

        {status && (
          <p className="text-sm text-gray-500 mt-2 text-center">{status}</p>
        )}
      </div>
    </div>
  </div>
)}

              </CardContent>
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8"
          >
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
  navigate("/user-info");
  window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
}}>
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile Information
                  </Button>
                  {/*<Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Notification Preferences
                  </Button>*/}
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/privacy-policy")}>
                    <Lock className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/terms-of-service")}>
                    <Lock className="h-4 w-4 mr-2" />
                    Terms Of Service
                  </Button>
                  <Button
                  onClick={() => setShowFeedback(true)}
                    variant="outline"
                    className="w-full justify-start bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    💬 Send Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
