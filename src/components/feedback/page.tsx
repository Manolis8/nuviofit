import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/components/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

export default function FeedbackPage() {
  const { user } = useUser();
  const { getToken } = useAuth(); // Clerk JWT
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!feedback.trim()) return;
  if (!user) {
    alert("You must be signed in to send feedback.");
    return;
  }

  setIsSubmitting(true);
  try {
    // 1️⃣ Get Clerk token for RLS
    const token = await getToken({ template: "supabase" });

    // 2️⃣ Create a Supabase client with the token
    const supabaseClientWithAuth = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for RLS
          },
        },
      }
    );

    // 3️⃣ Use the client for queries
    const { data: onboardData, error: onboardError } = await supabaseClientWithAuth
      .from("onboarding_responses")
      .select("username")
      .eq("user_id", user.id)
      .single();

    if (onboardError) throw onboardError;

    const username = onboardData?.username || "unknown";
    const email = user.emailAddresses?.[0]?.emailAddress ?? "";

    const { error: insertError } = await supabaseClientWithAuth
      .from("feedback")
      .insert([{ user_id: user.id, username, email, message: feedback }]);

    if (insertError) throw insertError;

    setIsSubmitted(true);
  } catch (error) {
    console.error(error);
    alert("There was an error sending your feedback. Please try again later.");
  } finally {
    setIsSubmitting(false);
  }
};



  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-6 text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center py-16">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-teal-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-teal-600 mb-4">Thank You! 💪</h1>
              <p className="text-xl text-gray-700 mb-6">
                Thank you for helping us grow stronger together!
              </p>
              <p className="text-gray-600 max-w-md mx-auto">
                Your feedback is invaluable to us. We're constantly working to make NuvioFit better, and voices like yours help us build a community of champions who never quit.
              </p>
            </div>

            <Button
              onClick={handleBack}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Continue Your Journey 🚀
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="outline"
          onClick={handleBack}
          className="mb-6 text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-4">
            Your Feedback Powers Our Progress
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We're on a mission to help you push your limits and grow stronger every day. Your honest feedback helps us
            improve NuvioFit to serve you better.
          </p>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-800 leading-relaxed">
              Remember, every great journey starts with a single step. By sharing your thoughts, you're helping build a
              community of champions who don't quit. Be honest, be real — your voice matters. 🔥
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
            <CardTitle className="text-2xl font-bold text-center">Share Your Thoughts</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="feedback" className="text-gray-700 font-medium text-lg">
                  Your Feedback *
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you love, what we can do better, or any ideas you have..."
                  required
                  rows={8}
                  className="mt-2 resize-none shadow-md border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl text-base"
                />
                <p className="text-sm text-gray-500 mt-2">{feedback.length} characters</p>
              </div>

              <Button
                type="submit"
                disabled={!feedback.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Feedback
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">NuvioFit — Built to help you stay Hungry!</p>
        </div>
      </div>
    </div>
  )
}
