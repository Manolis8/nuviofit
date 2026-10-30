import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Zap, Calendar, Clock, Target, Save, X } from "lucide-react"
import { Link } from "react-router-dom"
import { supabase } from "@/components/lib/supabaseClient";
import { useUser } from "@clerk/clerk-react";
import { aiEditFitnessPlan } from "@/components/lib/EditFitnessPlan";
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"


const LoadingSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="relative overflow-hidden border-b border-gray-200 pb-4 sm:pb-6">
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse flex-shrink-0">
            <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded-full opacity-50"></div>
          </div>
          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="h-5 sm:h-6 w-32 sm:w-48 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
              </div>
              <div className="h-4 sm:h-5 w-12 sm:w-16 rounded-full bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded-full opacity-50"></div>
              </div>
            </div>
            <div className="h-3 sm:h-4 w-16 sm:w-24 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
              <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="h-3 w-24 sm:w-32 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
              </div>
              <div className="h-3 w-20 sm:w-28 rounded bg-gradient-to-r from-emerald-200 to-cyan-200 animate-pulse">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-shimmer rounded opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
      </div>
    ))}
  </div>
)

export default function EditFitnessPlanPage() {
  const { user, isLoaded } = useUser();
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [hasUsedOnce, setHasUsedOnce] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [fitnessPlan, setFitnessPlan] = useState<string>(""); 
  const [nextResetDate, setNextResetDate] = useState<Date | null>(null);
  const [editPlanTimes, setEditPlanTimes] = useState<number>(0);
      const { getClient } = useSupabaseClientWithAuth();


// -------------------------Reset logic-----------------

useEffect(() => {
  if (!user || !isLoaded) return;

  const checkAndResetPlanEditLimit = async () => {
            const supabaseAuthClient = await getClient();
    const { data, error } = await supabaseAuthClient
      .from("onboarding_responses")
      .select("editplantimes, last_reset_at")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      console.error("Error fetching user plan edit info:", error?.message);
      return;
    }

    const today = new Date();
    const thisMonthResetDate = new Date(today.getFullYear(), today.getMonth(), 16);
    const nextMonthResetDate = new Date(today.getFullYear(), today.getMonth() + 1, 16);
    const lastResetDate = data.last_reset_at ? new Date(data.last_reset_at) : null;

    // Set for UI
    setNextResetDate(today < thisMonthResetDate ? thisMonthResetDate : nextMonthResetDate);

    if (!lastResetDate || (lastResetDate < thisMonthResetDate && today >= thisMonthResetDate)) {
              const supabaseAuthClient = await getClient();
      const { error: updateError } = await supabaseAuthClient
        .from("onboarding_responses")
        .update({
          editplantimes: 1,
          last_reset_at: thisMonthResetDate.toISOString().slice(0, 10),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Failed to reset edit limit:", updateError.message);
      } else {
        console.log("✅ Reset edit limit to 1 for this month.");
        setEditPlanTimes(1);
      }
    } else {
      setEditPlanTimes(data.editplantimes);
    }
  };

  checkAndResetPlanEditLimit();
}, [user, isLoaded]);


const handleGeneratePlan = async () => {
  if (editPlanTimes <= 0) {
    alert("You can only edit your plan once per month. Wait until the next reset.");
    return;
  }

  // Proceed to AI generate plan...

  // After generating successfully:
          const supabaseAuthClient = await getClient();
  const { error: updateError } = await supabaseAuthClient
    .from("onboarding_responses")
    .update({
      editplantimes: editPlanTimes - 1,
    })
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Failed to decrement edit times:", updateError.message);
  } else {
    setEditPlanTimes((prev) => prev - 1);
  }
};



//------------------------uptdate fitness plan logic----
useEffect(() => {
  const fetchFitnessPlan = async () => {
    if (!user) return;
        const supabaseAuthClient = await getClient();
    const { data, error } = await supabaseAuthClient
      .from("onboarding_responses")
      .select("fitness_plan")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching fitness plan:", error);
      return;
    }

    if (data?.fitness_plan) {
      // Extract from "Day 1" onwards (optional, based on your text)
      const fullText = data.fitness_plan;
      const startIndex = fullText.indexOf("Day 1");
      const planText = startIndex !== -1 ? fullText.slice(startIndex) : fullText;

      setFitnessPlan(planText);  // Put fetched plan here
      setPrompt("");             // Keep prompt EMPTY for user input
    }
  };

  fetchFitnessPlan();
}, [user]);



  // Prevent navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges])


  const handleSubmit = async () => {
  if (editPlanTimes <= 0 || !prompt.trim()) {
    return;
  }

  setIsLoading(true);

  try {
    const updatedPlan = await aiEditFitnessPlan(user.id, fitnessPlan, prompt);
    setFitnessPlan(updatedPlan);
    setHasChanges(true);
    setPrompt("");
        const supabaseAuthClient = await getClient();
    await supabaseAuthClient
      .from("onboarding_responses")
      .update({
        editplantimes: editPlanTimes - 1
      })
      .eq("user_id", user.id);

    setEditPlanTimes((prev) => prev - 1);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};



const handleCancel = () => {
  if (hasChanges) {
    const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
    if (confirmLeave) {
      window.location.href = "/workout-page";
    }
  } else {
    window.location.href = "/workout-page";
  }
};


const handleSavePlanToSupabase = async (planToSave: string) => {
  if (!user) return;
  setIsLoading(true);
        const supabaseAuthClient = await getClient();
  const { error } = await supabaseAuthClient
    .from("onboarding_responses")
    .update({ fitness_plan: planToSave })
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to save fitness plan:", error);
    setIsLoading(false);
    return;
  }

  setHasChanges(false);
  setShowSaveDialog(true);
  setTimeout(() => {
    setShowSaveDialog(false);
    window.location.href = "/workout-page"; // Redirect after success
  }, 2000);
  setIsLoading(false);
};


  const wordCount = prompt.split(" ").filter((word) => word.length > 0).length


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Save Success Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Save className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Plan Saved Successfully!</h3>
              <p className="text-sm sm:text-base text-gray-600">Your fitness plan has been updated and saved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/workout-page">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 bg-transparent text-xs sm:text-sm px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back
            </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-400 flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent truncate">
                  AI Fitness Plan Editor
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm truncate">Customize your workout with AI assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
{hasChanges && (
  <div className="rounded-md bg-emerald-50 border border-emerald-300 text-emerald-700 text-sm p-4 mb-4">
    ✅ You have updated your fitness plan. Click <strong>Save</strong> to apply your changes.
  </div>
)}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Side - 7-Day Plan in One Big Div */}
<div className="space-y-4 sm:space-y-6">
  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">7-Day Fitness Plan</h2>
  </div>

<Card className={`${hasChanges ? "border-2 border-emerald-400" : "border-gray-200"} bg-white shadow-sm`}>
  <CardContent className="p-3 sm:p-6">
    {isLoading ? (
      <LoadingSkeleton />
    ) : (
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {fitnessPlan}
      </pre>
    )}
  </CardContent>
</Card>


  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
<Button
  onClick={() => handleSavePlanToSupabase(fitnessPlan)}
  disabled={!hasChanges}
  className="bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
>
  <Save className="w-4 h-4 mr-2" />
  Save Plan
</Button>

    <Link to="/workout-page">
      <Button
        variant="outline"
        className="border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 px-6 sm:px-8 py-2.5 sm:py-2 bg-transparent text-sm sm:text-base"
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </Link>
  </div>
</div>



          {/* Right Side - AI Input Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-400">
                <Send className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Customize Your Plan</h2>
            </div>

            {editPlanTimes > 0 ? (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      What would you like to change about your fitness plan?
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., 'Add more cardio exercises to Tuesday and Thursday', 'Make the workouts shorter', 'Focus more on upper body strength'..."
                      className="min-h-[150px] sm:min-h-[200px] bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none text-sm sm:text-base"
                      maxLength={1250} 
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${wordCount > 200? "text-red-500" : "text-gray-500"}`}>
                        {wordCount}/200 words
                      </span>
                      <span className="text-gray-400">{prompt.length}/900 characters</span>    
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || wordCount > 200 || isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-600 hover:to-cyan-500 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs sm:text-sm">AI is updating your plan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Update Fitness Plan
                      </div>
                    )}
                  </Button>
<label style={{ display: 'block', fontSize: '0.9rem', color: '#888', fontStyle: 'italic', marginTop: '10px' }}>
    Remember: You can edit your fitness plan once per month.
</label>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Plan Updated!</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Your fitness plan has been customized with AI. You can only use the AI assistant once per
                        month.
                      </p>
                      {nextResetDate && (
  <p className="text-sm text-gray-500">
    Renewal Date: {nextResetDate.getDate()}/{nextResetDate.getMonth() + 1}/{nextResetDate.getFullYear()}
  </p>
)}
                    </div>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong>Tip:</strong> Save your plan to keep the changes, or cancel to discard them.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
