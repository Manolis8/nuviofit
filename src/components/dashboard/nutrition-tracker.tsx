"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Check, Droplet } from "lucide-react"
import { useState } from "react"

export function NutritionTracker() {
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
  })

  const [waterGlasses, setWaterGlasses] = useState(4)
  const totalWaterGlasses = 8

  const toggleMeal = (meal) => {
    setMeals((prev) => ({ ...prev, [meal]: !prev[meal] }))
  }

  const addWaterGlass = () => {
    if (waterGlasses < totalWaterGlasses) {
      setWaterGlasses(waterGlasses + 1)
    }
  }

  const completedMeals = Object.values(meals).filter(Boolean).length

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>🍽️ Nutrition & Recovery</CardTitle>
        <CardDescription>Track your meals, hydration, and sleep</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meals">🍽️ Meals</TabsTrigger>
            <TabsTrigger value="hydration">💧 Water</TabsTrigger>
            <TabsTrigger value="sleep">😴 Sleep</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            <div className="mb-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Daily Progress: {completedMeals}/4 meals
                </span>
                <span className="text-lg">{completedMeals === 4 ? "🎉" : completedMeals >= 2 ? "👍" : "🍽️"}</span>
              </div>
              <Progress
                value={(completedMeals / 4) * 100}
                className="mt-2 h-2 bg-slate-200 dark:bg-slate-700"
                indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-500"
              />
            </div>

            <div className="space-y-3">
              {[
                {
                  meal: "Breakfast",
                  time: "7:00 AM",
                  description: "Greek yogurt with berries and honey 🫐",
                  calories: "320 cal",
                  emoji: "🥣",
                  key: "breakfast",
                },
                {
                  meal: "Lunch",
                  time: "12:30 PM",
                  description: "Grilled chicken salad with avocado 🥑",
                  calories: "450 cal",
                  emoji: "🥗",
                  key: "lunch",
                },
                {
                  meal: "Dinner",
                  time: "7:00 PM",
                  description: "Baked salmon with quinoa and vegetables 🐟",
                  calories: "520 cal",
                  emoji: "🍽️",
                  key: "dinner",
                },
                {
                  meal: "Snack",
                  time: "3:30 PM",
                  description: "Apple with almond butter 🥜",
                  calories: "180 cal",
                  emoji: "🍎",
                  key: "snack",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleMeal(item.key)}
                  className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                    meals[item.key]
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white">{item.meal}</span>
                        <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{item.time}</span>
                        <span className="ml-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                          {item.calories}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        meals[item.key]
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                      }`}
                    >
                      {meals[item.key] && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hydration" className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">💧 Water Intake</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {waterGlasses} of {totalWaterGlasses} glasses ({waterGlasses * 250}ml / {totalWaterGlasses * 250}ml)
                  </p>
                </div>
                <button
                  onClick={addWaterGlass}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900/30 dark:text-blue-400"
                  disabled={waterGlasses >= totalWaterGlasses}
                >
                  <Droplet className="h-5 w-5" />
                </button>
              </div>
              <Progress
                value={(waterGlasses / totalWaterGlasses) * 100}
                className="h-3 bg-slate-100 dark:bg-slate-800"
                indicatorClassName="bg-gradient-to-r from-blue-400 to-blue-500"
              />
              <div className="mt-4 flex justify-between">
                {Array.from({ length: totalWaterGlasses }).map((_, i) => (
                  <div
                    key={i}
                    className={`text-2xl ${i < waterGlasses ? "text-blue-500" : "text-slate-200 dark:text-slate-700"}`}
                  >
                    💧
                  </div>
                ))}
              </div>
              {waterGlasses >= totalWaterGlasses && (
                <div className="mt-3 rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950/20">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    🎉 Great job! You've reached your daily hydration goal!
                  </span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sleep" className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4">
                <h3 className="font-medium text-slate-900 dark:text-white">😴 Sleep Tracking</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last night: 7h 20m</p>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <div className="text-3xl">😴</div>
                <Progress
                  value={(7.33 / 9) * 100}
                  className="h-3 flex-1 bg-slate-100 dark:bg-slate-800"
                  indicatorClassName="bg-gradient-to-r from-indigo-400 to-purple-500"
                />
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">81%</div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>0h</span>
                <span>Recommended: 7-9h</span>
                <span>12h</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sleep Quality</p>
                  <p className="font-medium text-slate-900 dark:text-white">Good 😊</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Deep Sleep</p>
                  <p className="font-medium text-slate-900 dark:text-white">2h 15m</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
