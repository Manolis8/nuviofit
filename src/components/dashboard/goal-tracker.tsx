"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus, Trophy } from "lucide-react"

export function GoalTracker() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>🎯 Goals & Challenges</CardTitle>
          <CardDescription>Track your progress and compete</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            title: "Lose 3kg",
            timeframe: "4 weeks left",
            progress: 33,
            current: "1kg lost",
            target: "3kg",
            emoji: "⚖️",
            color: "from-[#4ECDC4] to-[#56A7F2]",
            status: "on-track",
          },
          {
            title: "Run 5K",
            timeframe: "6 weeks left",
            progress: 60,
            current: "3km",
            target: "5km",
            emoji: "🏃‍♀️",
            color: "from-[#56A7F2] to-[#9F7AEA]",
            status: "ahead",
          },
          {
            title: "30 Day Plank Challenge",
            timeframe: "9 days left",
            progress: 70,
            current: "Day 21",
            target: "Day 30",
            emoji: "💪",
            color: "from-[#9F7AEA] to-[#FF6B6B]",
            status: "on-track",
          },
        ].map((goal, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-xl">{goal.emoji}</div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{goal.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{goal.timeframe}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{goal.current}</div>
                <div
                  className={`text-xs ${
                    goal.status === "ahead"
                      ? "text-emerald-500"
                      : goal.status === "behind"
                        ? "text-red-500"
                        : "text-blue-500"
                  }`}
                >
                  {goal.status === "ahead" ? "🔥 Ahead!" : goal.status === "behind" ? "⚠️ Behind" : "✅ On track"}
                </div>
              </div>
            </div>
            <Progress
              value={goal.progress}
              className="h-2 bg-slate-100 dark:bg-slate-800"
              indicatorClassName={`bg-gradient-to-r ${goal.color}`}
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>0</span>
              <span>{goal.progress}% complete</span>
              <span>{goal.target}</span>
            </div>
          </div>
        ))}

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium text-slate-900 dark:text-white">🏆 Weekly Challenge</h3>
          </div>
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
            "Consistency Champion" - Complete 5 workouts this week
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md bg-amber-50 p-2 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                  🥇
                </div>
                <span className="font-medium text-slate-900 dark:text-white">You</span>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">3/5 workouts</span>
            </div>
            <div className="flex items-center justify-between rounded-md p-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800">
                  2
                </div>
                <span className="text-slate-900 dark:text-white">Sarah K.</span>
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300">4/5 workouts</span>
            </div>
            <div className="flex items-center justify-between rounded-md p-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800">
                  3
                </div>
                <span className="text-slate-900 dark:text-white">Mike T.</span>
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300">2/5 workouts</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
