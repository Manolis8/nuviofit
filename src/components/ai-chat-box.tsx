import { useState } from "react"
import { Send } from "lucide-react"
import { getOpenAIResponse } from "@/components/lib/frontendOpenai" // adjust path if needed
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getMessagesLeft } from "@/components/lib/getMessagesLeft"
import { decrementMessagesLeft } from "@/services/supabaseMessages"
import { useUser } from "@clerk/clerk-react"
import { useSupabaseClientWithAuth } from "@/components/lib/supabaseAuthClient"


type Message = {
  role: "user" | "assistant"
  content: string
}

export function AIChatBox() {

const { user } = useUser();
const userId = user?.id;
const { getClient } = useSupabaseClientWithAuth();


  function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }
  function isTooDense(text: string): boolean {
    return wordCount(text) <= 75 && text.length > 500;
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI health coach. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const MAX_MESSAGES = 30;

const handleSend = async () => {
  if (!input.trim()) return;

  if (wordCount(input) > 75) {
    alert("Please limit your message to 75 words.");
    return;
  }

  if (isTooDense(input)) {
    alert("You are over the maximum character limit of 500 characters.");
    return;
  }

  // 🧠 Check messages left before sending
  const supabaseAuthClient = await getClient();
  const messagesLeft = await getMessagesLeft(supabaseAuthClient, userId);

  if (messagesLeft <= 0) {
    alert("You have no messages left. Please upgrade or wait.");
    return;
  }

  const userMessage: Message = {
    role: "user",
    content: input,
  };

  let updatedMessages = [...messages, userMessage];
  if (updatedMessages.length > MAX_MESSAGES) {
    updatedMessages = updatedMessages.slice(-MAX_MESSAGES);
  }

  setMessages(updatedMessages);
  setInput("");
  setIsLoading(true);

  try {
    const reply = await getOpenAIResponse(updatedMessages);

    const assistantMessage: Message = {
      role: "assistant",
      content: reply,
    };

    let newMessages = [...updatedMessages, assistantMessage];
    if (newMessages.length > MAX_MESSAGES) {
      newMessages = newMessages.slice(-MAX_MESSAGES);
    }
    setMessages(newMessages);

    // ✅ Decrement only after success
    await decrementMessagesLeft(supabaseAuthClient, userId);
  } catch (err) {
    console.error(err);

    const errorFallback: Message = {
      role: "assistant",
      content: "Error: Unable to connect to AI right now.",
    };

    let errorMsgs = [...updatedMessages, errorFallback];
    if (errorMsgs.length > MAX_MESSAGES) {
      errorMsgs = errorMsgs.slice(-MAX_MESSAGES);
    }

    setMessages(errorMsgs);
  } finally {
    setIsLoading(false);
  }
};




  // Show only last 40 messages for display
  const messagesToShow = messages.length > 30 ? messages.slice(-30) : messages;

  return (
    <div className="flex h-[250px] md:h-[300px] flex-col rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messagesToShow.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No messages yet. Start the conversation below!
            </p>
          ) : (
            messagesToShow.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-slate-100 px-4 py-2 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 p-2 dark:border-slate-800">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask your AI coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (wordCount(input) <= 75) {
                    handleSend();
                  }
                }
              }}
              className="border-slate-200 dark:border-slate-700 text-sm"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isLoading || !input.trim() || wordCount(input) > 75}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Word Counter Below Input */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
            {wordCount(input)} / 75 words
          </p>
        </div>
      </div>
    </div>
  );
}

