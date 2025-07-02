import { useState } from "react"
import { UserWelcomeSection } from "@/components/dashboard/user-welcome-section"
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel"
import { WorkoutModule } from "@/components/dashboard/workout-module"
import { NutritionPlan } from "@/components/dashboard/nutrition-plan"
import { MindRecoverySection } from "@/components/dashboard/mind-recovery-section"
import { GoalChallengeTracker } from "@/components/dashboard/goal-challenge-tracker"
import { SmartwatchSync } from "@/components/dashboard/smartwatch-sync"
import { AIChatCoach } from "@/components/dashboard/ai-chat-coach"
import { Navbar } from "@/components/navigation/navbar"
import { CalendarView } from "@/components/dashboard/calendar-view"
import { SettingsProfile } from "@/components/dashboard/settings-profile"

export default function DashboardPage() {
  const [showWorkout, setShowWorkout] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          {/* User Welcome Section */}
          <UserWelcomeSection />

          {/* Calendar View Section */}
          <CalendarView />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Analytics & Workout */}
            <div className="lg:col-span-8 space-y-6">
              <AnalyticsPanel />
              <WorkoutModule />
            </div>

            {/* Right Column - Nutrition & Recovery */}
            <div className="lg:col-span-4 space-y-6">
              <NutritionPlan />
              <MindRecoverySection />
            </div>
          </div>

          {/* Bottom Grid - Goals, Smartwatch, Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GoalChallengeTracker />
            <SmartwatchSync />
             <div className="md:col-span-2 lg:col-span-1">
              <SettingsProfile onOpenSettings={() => setShowSettings(true)} />
            </div>
          </div>
        </div>

        {/* Floating AI Chat Coach */}
        <AIChatCoach />
      </div>
    </>
  )
}
