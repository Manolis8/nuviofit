import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { getMessagesLeft } from "@/components/lib/getMessagesLeft"
import { useAutoRenewMessages } from "@/components/lib/useAutoRenewMessages"
import { AIChatBox } from "@/components/ai-chat-box"
import { useUser } from "@clerk/clerk-react"
import { sendFeedback } from "../lib/sendFeedback";
import { addDays } from "date-fns";
import Link from "next/link";

const feedback_url = process.env.FEEDBACK_URL;
export function AIChatCoach() {
  const [isOpen, setIsOpen] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState("");
const [formData, setFormData] = useState({
  name: "",
  email: "",
  message: ""
});
const [status, setStatus] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const [messagesLeft, setMessagesLeft] = useState<number | null>(null);
  const { lastResetAt } = useAutoRenewMessages(user.id);

  // Calculate next renewal date by adding 30 days to lastResetAt
  const nextRenewalDate = lastResetAt ? addDays(lastResetAt, 30) : null;
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1); // next month

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchMessages = async () => {
      const count = await getMessagesLeft(user.id); // should return number
      setMessagesLeft(count);
    };

    fetchMessages();
  }, [isLoaded, user]);
  
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
    {nextRenewalDate && (
  <p>Renewal date: {nextRenewalDate.toLocaleDateString()}</p>
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
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
        />

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
  } catch {
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
