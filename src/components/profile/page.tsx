import { motion } from "framer-motion"
import { User, Flame, Trophy, Calendar, Settings, Crown, Lock, Bell } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/components/lib/supabaseClient";
import { useEffect} from "react"
import { useState } from "react"
import { useUser } from "@clerk/clerk-react"

const achievements = [
  { emoji: "🔥", title: "First Workout", unlocked: false },
  { emoji: "💪", title: "Week Warrior", unlocked: false },
  { emoji: "🏃‍♀️", title: "Cardio King", unlocked: false },
  { emoji: "🎯", title: "Goal Getter", unlocked: false },
  { emoji: "🏆", title: "Champion", unlocked: false },
  { emoji: "👑", title: "Fitness Royalty", unlocked: false },
]

export default function ProfilePage() {
  const navigate = useNavigate()
    const { user, isLoaded } = useUser()
    const [displayName, setDisplayName] = useState(
   user?.username ||  "User"
);
  const isValidDisplayName = displayName.length >= 4 && displayName.length <= 30;

  const email = user?.primaryEmailAddress?.emailAddress || "Unknown";

const [username, setUsername] = useState("");

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
      email: user.primaryEmailAddress?.emailAddress || "",
    }));
  }
}, [user]);

  const [userData, setUserData] = useState({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
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
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{userData.email}</p>
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

<Button className="w-full mt-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white">
  🔔 Join Waitlist
</Button>

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
