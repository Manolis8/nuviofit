import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { getMessagesLeft } from "@/components/lib/getMessagesLeft"
import { useAutoRenewMessages } from "@/components/lib/useAutoRenewMessages"
import { AIChatBox } from "@/components/ai-chat-box"
import { useUser } from "@clerk/clerk-react"
import { addDays } from "date-fns";
import Link from "next/link";
import { supabase } from "@/components/lib/supabaseClient";

export function AIChatCoach() {
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messagesLeft, setMessagesLeft] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [nextResetDate, setNextResetDate] = useState<Date | null>(null);


  // --------------------- Fetch User Data ---------------------
  useEffect(() => {
    if (!user) return;

    setEmail(user.emailAddresses[0]?.emailAddress || "");

    const fetchUserData = async () => {
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

    fetchUserData();
  }, [user]);

  // --------------------- Monthly Messages Reset ---------------------
  useEffect(() => {
    if (!user || !isLoaded) return;

const checkAndResetMessages = async () => {
  const { data, error } = await supabase
    .from("onboarding_responses")
    .select("messages_left, last_reset_at")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching user reset info:", error?.message);
    return;
  }

  const today = new Date();
  const lastResetDate = data.last_reset_at ? new Date(data.last_reset_at) : null;

if (lastResetDate) {
  const nextResetDateCalc = new Date(lastResetDate);
  nextResetDateCalc.setDate(nextResetDateCalc.getDate() + 30);
  setNextResetDate(nextResetDateCalc);
}

  if (today >= nextResetDate) {
    const { error: updateError } = await supabase
      .from("onboarding_responses")
      .update({
        messages_left: 40,
        last_reset: today.toISOString().slice(0, 10),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to reset messages:", updateError.message);
    } else {
      console.log("✅ Messages successfully reset after 30 days.");
      setMessagesLeft(40);
    }
  } else {
    setMessagesLeft(data.messages_left);
  }
};


    checkAndResetMessages();
  }, [user, isLoaded]);

  // --------------------- Submit Feedback ---------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!user?.id) {
      setError("You must be logged in.");
      return;
    }

    if (!feedbackText.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }

    const { error: insertError } = await supabase.from("feedback").insert([
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

  // --------------------- Manual Feedback Sender (Optional) ---------------------
  async function sendFeedback(formData: { name: string; email: string; message: string }) {
    if (!user?.id) throw new Error("User not logged in.");

    const { data, error: fetchError } = await supabase
      .from("onboarding_responses")
      .select("username")
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch username:", fetchError.message);
      throw fetchError;
    }

    const username = data?.username || formData.name || "Unknown";

    const { error: insertError } = await supabase.from("feedback").insert([
      {
        user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        username,
        message: formData.message,
      },
    ]);

    if (insertError) {
      console.error("Failed to send feedback:", insertError.message);
      throw insertError;
    }
  }

  // --------------------- Render ---------------------
  return (
    <>
{/* Floating Action Buttons */}
<div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
  {/* Feedback Button */}
  <Button
    onClick={() => setShowFeedback(true)}
    size="icon"
    className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:from-blue-600 hover:to-green-600 hover:shadow-xl transition-all duration-200"
  >
    <Send className="h-5 w-5" />
  </Button>

{/* AI Chat Button */}
<Button
  onClick={() => setIsOpen(!isOpen)}
  size="icon"
  className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:from-blue-600 hover:to-green-600 hover:shadow-xl transition-all duration-200"
>
  <MessageCircle className="h-6 w-6" />
</Button>

</div>

{/* AI Chat Modal - Mobile Friendly */}
{isOpen && (
  <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end p-4 md:pr-6 md:pb-6">
    {/* Mobile: Full screen overlay */}
    <div className="md:hidden fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

    {/* Chat Container */}
    <div className="relative w-full max-w-md md:max-w-sm bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[80vh] md:max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Coach</h3>
            <p className="text-xs text-gray-500">Always here to help</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 min-h-0">
        <AIChatBox />
      </div>

      {/* Messages Left Info */}
      <div className="flex flex-col items-center mt-4 px-6 py-3 bg-white rounded-lg shadow-sm text-gray-700 text-sm font-medium">
  <div className="flex items-center space-x-3">
<Link href="/user-info#ai-messages" scroll={false}>
  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium cursor-pointer hover:bg-indigo-200 transition">
    👉 view messages
  </span>
</Link>
{user && nextResetDate && (
  <p>Renewal date: {nextResetDate.toLocaleDateString()}</p>
)}



  </div>
</div>
    </div>
  </div>
)}

{/* Feedback Modal */}
{showFeedback && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-bold mb-4">Send Feedback</h3>
      <p className="text-gray-600 mb-4">Help us improve your experience!</p>

      <div className="space-y-3">

        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Your Message"
          className="w-full p-3 border rounded-lg h-24 resize-none"
        />

        <div className="flex gap-2">
<Button
  onClick={async () => {
    setStatus("Sending...");
    try {
      await sendFeedback(formData);
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
    </>
  )
}
