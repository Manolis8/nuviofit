import { motion } from "framer-motion"
import { Bell, ChefHat, Utensils, Apple } from "lucide-react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; 
import { supabase } from "@/components/lib/supabaseClient";
import { Input } from "@/components/ui/input";


export default function NutritionPage() {
    const [showPopup, setShowPopup] = useState(false);
const [formData, setFormData] = useState({
    selectedOptions: [] as string[],
});


const [status, setStatus] = useState<string | null>(null);

async function sendWaitlist(data: { name: string; email: string; message: string }) {
    try {
        const { error } = await supabase.from("waitlist").insert([
            {
                name: data.name,
                email: data.email,
                message: data.message,
            },
        ]);
        if (error) throw error;
    } catch (err) {
        throw err;
    }
}



  const { user } = useUser(); // Get authenticated Clerk user info
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch username from Supabase table onboarding_responses
useEffect(() => {
        async function fetchUsername() {
            if (!user) return;
            setEmail(user.emailAddresses[0]?.emailAddress || "");

            const { data, error } = await supabase
                .from("onboarding_responses")
                .select("username")
                .eq("email", user.emailAddresses[0]?.emailAddress)
                .single();

            if (error) {
                console.error("Error fetching username:", error.message);
            } else if (data?.username) {
                setUsername(data.username);
            }
        }

        fetchUsername();
    }, [user]);

  // Checkbox change handler
  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

const waitlistOptions = [
    "I'm interested in AI tools",
    "I'm looking for business growth",
    "I want networking opportunities",
    "I need help with productivity",
];


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedOptions.length === 0) {
        setError("Please select at least one option.");
        return;
    }

    setLoading(true);

    try {
        await sendWaitlist({
            name: username,
            email: email,
            message: selectedOptions.join(", "),
        });
        setError("");
        setShowPopup(false);
        alert("You successfully joined the waitlist!");
    } catch (err) {
        console.error(err);
        setError("Failed to join waitlist. Try again.");
    } finally {
        setLoading(false);
    }
};


  // Checkbox options example
  const options = [
    "Low Carb",
    "High Protein",
    "Vegetarian",
    "Gluten Free",
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6">
          {/* Coming Soon Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <div className="text-8xl mb-4">🥗</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Nutrition plans are cooking...
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Coming soon! We're preparing something delicious for your health journey.
              </p>
            </div>

            {/* Notify Me Card */}
            <Card className="max-w-md mx-auto border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Get Notified
                </CardTitle>
                <CardDescription>Be the first to know when nutrition features launch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
<Button
  onClick={() => setShowPopup(true)}
  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
>
  🔔 Notify me when it's ready
</Button>

              </CardContent>
            </Card>

            {showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-lg">
      <h3 className="text-lg font-bold mb-4">Join the Waitlist</h3>
      <p className="text-gray-600 mb-4">Enter your details below to get notified!</p>

      <div className="flex gap-2">


        {waitlistOptions.map((option, idx) => (
    <div key={idx} className="flex items-center space-x-2">
        <input
            type="checkbox"
            id={`option-${idx}`}
            checked={formData.selectedOptions.includes(option)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...formData.selectedOptions, option]
                    : formData.selectedOptions.filter((item) => item !== option);
                setFormData({ ...formData, selectedOptions: updated });
            }}
        />
        <label htmlFor={`option-${idx}`}>{option}</label>
    </div>
))}

{waitlistOptions.map((option, idx) => (
    <div key={idx} className="flex items-center space-x-2">
        <input
            type="checkbox"
            id={`option-${idx}`}
            checked={selectedOptions.includes(option)}
            onChange={() => handleCheckboxChange(option)}
        />
        <label htmlFor={`option-${idx}`}>{option}</label>
    </div>
))}

<Button
    onClick={async () => {
        if (formData.selectedOptions.length === 0) {
            setStatus("Please select at least one option.");
            return;
        }

        setStatus("Sending...");

        const updatedFormData = {
            name: username,
            email: email,
            message: formData.selectedOptions.join(", "), // Send options as comma-separated string
        };

        try {
            await sendWaitlist(updatedFormData);
            setStatus("Success! We'll notify you.");
            setFormData({ selectedOptions: [] });
            setTimeout(() => {
                setShowPopup(false);
                setStatus(null);
            }, 1500);
        } catch {
            setStatus("Failed to send.");
        }
    }}
>
    Join Waitlist
</Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </Button>
      </div>

      {status && <p className="text-sm text-center mt-2">{status}</p>}
    </div>
  </div>
)}

          </motion.div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <ChefHat className="h-8 w-8 text-orange-500" />,
                title: "AI Meal Planning",
                description: "Personalized meal plans based on your goals and preferences",
                emoji: "👨‍🍳",
              },
              {
                icon: <Utensils className="h-8 w-8 text-green-500" />,
                title: "Recipe Library",
                description: "Thousands of healthy recipes with step-by-step instructions",
                emoji: "📚",
              },
              {
                icon: <Apple className="h-8 w-8 text-red-500" />,
                title: "Nutrition Tracking",
                description: "Track calories, macros, and nutrients with smart logging",
                emoji: "📊",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-none shadow-md bg-white/60 backdrop-blur-sm h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 text-4xl">{feature.emoji}</div>
                    <div className="mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Construction Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto border-none shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Under Construction</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our nutrition experts and AI developers are working hard to bring you the most comprehensive nutrition
                  platform. Expected launch: Q2 2024.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["🥑", "🍎", "🥕", "🥬", "🍓", "🥜", "🐟", "🍗"].map((emoji, index) => (
                    <motion.span
                      key={index}
                      className="text-2xl"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: index * 0.2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
