import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,LineChart,Line,PieChart,Pie,Cell,} from "recharts"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Lock } from "lucide-react";
import { useUser } from "@clerk/clerk-react"
import { supabase } from "@/components/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";


const stepsData = [
  { day: "Mon", steps: 8500, goal: 10000 },
  { day: "Tue", steps: 12000, goal: 10000 },
  { day: "Wed", steps: 9500, goal: 10000 },
  { day: "Thu", steps: 11200, goal: 10000 },
  { day: "Fri", steps: 8800, goal: 10000 },
  { day: "Sat", steps: 15000, goal: 10000 },
  { day: "Sun", steps: 7200, goal: 10000 },
]

const moodData = [
  { day: "Mon", mood: 7, energy: 6 },
  { day: "Tue", mood: 8, energy: 8 },
  { day: "Wed", mood: 6, energy: 5 },
  { day: "Thu", mood: 9, energy: 9 },
  { day: "Fri", mood: 7, energy: 7 },
  { day: "Sat", mood: 9, energy: 8 },
  { day: "Sun", mood: 8, energy: 6 },
]

export function AnalyticsPanel() {
      const { getToken } = useAuth(); // Clerk JWT
  const today = new Date();
const startOfWeek = new Date(today);

startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday = 0, Monday = 1, etc.
const weekStartStr = startOfWeek.toISOString().split("T")[0]; // e.g., "2025-06-24"
const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ...
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const selectedDay = dayNames[dayIndex];


  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
  day: "",
  steps: "",
  mood: "",
  energy: ""
});
  const { user } = useUser()
const [stepsForm, setStepsForm] = useState({
  Monday: "",
  Tuesday: "",
  Wednesday: "",
  Thursday: "",
  Friday: "",
  Saturday: "",
  Sunday: ""
});

  const [entries, setEntries] = useState([])

  const [supabaseClient, setSupabaseClient] = useState(supabase);

  useEffect(() => {
    const initSupabase = async () => {
      if (!user) return;

      try {
        const token = await getToken();
        if (!token) throw new Error("Failed to get Supabase token from Clerk.");

        const client = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY,
          {
            global: {
              headers: { Authorization: `Bearer ${token}` },
            },
          }
        );

        setSupabaseClient(client); // override the supabase variable locally
      } catch (err) {
        console.error("Failed to init supabase client:", err);
      }
    };

    initSupabase();
  }, [user, getToken]);


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
  const fetchEntries = async () => {
    const { data, error } = await supabaseClient
      .from("onboarding_responses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(7)

    if (!error && data) {
      setEntries(data.reverse())
    }
  }

// Move this outside of handleSubmit or put it on top inside handleSubmit (without type annotations)
function parseSteps(text) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const result = Object.fromEntries(days.map(day => [day, ""]));

  if (!text) return result;

  text.split("\n").forEach(line => {
    const [day, value] = line.split(":").map(s => s.trim());
    if (day && result.hasOwnProperty(day)) {
      result[day] = value;
    }
  });

  return result;
}

const handleSubmit = async () => {
  if (!form.steps) {
    alert("Please enter your steps.");
    return;
  }

  let stepsObj = {
    Monday: "", Tuesday: "", Wednesday: "", Thursday: "", Friday: "", Saturday: "", Sunday: ""
  };
  let moodObj = { ...stepsObj };
  let energyObj = { ...stepsObj };

  const today = new Date();
  const dayIndex = today.getDay(); // Sunday = 0
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const selectedDay = dayNames[dayIndex];

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayIndex);
  const weekStartStr = startOfWeek.toISOString().split("T")[0];

  const { data, error } = await supabaseClient
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .eq("cycle_start", weekStartStr)
    .single();

  stepsObj[selectedDay] = form.steps;
  moodObj[selectedDay] = form.mood;
  energyObj[selectedDay] = form.energy;

const updatedStepsText = Object.entries(stepsObj)
  .map(([day, val]) => `${day}: ${val}`) // ← keep all 7 days
  .join("\n");

const updatedMoodText = Object.entries(moodObj)
  .map(([day, val]) => `${day}: ${val}`)
  .join("\n");

const updatedEnergyText = Object.entries(energyObj)
  .map(([day, val]) => `${day}: ${val}`)
  .join("\n");


  if (error && error.code !== "PGRST116") {
    console.error("Select error:", error);
    return;
  }

  if (data) {
    const { error: updateError } = await supabaseClient
      .from("onboarding_responses")
      .update({
        steps: updatedStepsText,
        mood: updatedMoodText,
        energy: updatedEnergyText,
      })
      .eq("user_id", user.id)
      .eq("cycle_start", weekStartStr);

    if (updateError) console.error("Update error:", updateError);
  } else {
    const { error: insertError } = await supabaseClient
      .from("onboarding_responses")
      .insert({
        user_id: user.id,
        cycle_start: weekStartStr,
        steps: updatedStepsText,
        mood: updatedMoodText,
        energy: updatedEnergyText,
      });

    if (insertError) console.error("Insert error:", insertError);
  }
};


useEffect(() => {
  const fetchMoodEnergy = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekStartStr = startOfWeek.toISOString().split("T")[0];

    const { data, error } = await supabaseClient
      .from("onboarding_responses")
      .select("mood, energy")
      .eq("user_id", user.id)
      .eq("cycle_start", weekStartStr)
      .single();

    if (!data?.mood || !data?.energy) return;

    const moodObj = parseSteps(data.mood);
    const energyObj = parseSteps(data.energy);

    const moodArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
      const short = day.slice(0, 3);
      return {
        day: short,
        mood: parseInt(moodObj[day] || "0"),
        energy: parseInt(energyObj[day] || "0"),
      };
    });

    setEntries(moodArray); // use this to populate moodData
  };

  fetchMoodEnergy();
}, []);


function stringifySteps(data: Record<string, string>) {
  return Object.entries(data)
    .map(([day, value]) => `${day}: ${value}`)
    .join("\n");
}


  useEffect(() => {
    fetchEntries()
  }, [])

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
<CardTitle className="flex items-center gap-2">
  📊 Analytics Dashboard
  <div className="flex items-center gap-1 text-sm text-muted-foreground">
    <Lock className="w-4 h-4" />
    <span className="text-xs">Coming in next upgrade</span>
  </div>
</CardTitle>

        <CardDescription>Your fitness insights at a glance</CardDescription>
      </CardHeader>
      <CardContent>

        <Tabs defaultValue="steps" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="steps">🚶 Steps</TabsTrigger>
            <TabsTrigger value="mood">😊 Mood</TabsTrigger>
          </TabsList>

          <TabsContent value="steps" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="goal" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="steps" fill="url(#stepsGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="mood" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                    name="😊 Mood"
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", strokeWidth: 2, r: 6 }}
                    name="⚡ Energy"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
