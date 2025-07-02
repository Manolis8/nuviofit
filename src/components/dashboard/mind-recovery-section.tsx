"use client"
import { Brain, Heart, Moon, Lock, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MindRecoverySection() {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧘 Mind & Recovery
          <Lock className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <CardDescription>Meditation, mindfulness, and mental wellness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Locked Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">🧘 Mental fitness is just as important</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">🔒 Meditation content launching soon</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Soon
          </Badge>
        </div>

        {/* Preview Features */}
        <div className="space-y-3 opacity-60">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Coming Soon:</h4>

          {/* Mindfulness Features */}
          <div className="grid gap-3">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Guided Meditation</p>
                  <p className="text-xs text-gray-400">5-30 minute sessions</p>
                </div>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Stress Management</p>
                  <p className="text-xs text-gray-400">Breathing exercises & techniques</p>
                </div>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Sleep Stories</p>
                  <p className="text-xs text-gray-400">Bedtime relaxation content</p>
                </div>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Brain className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Sessions</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Heart className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Stress Level</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Moon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Sleep Score</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white">
          <Bell className="h-4 w-4 mr-2" />🔔 Join Waitlist
        </Button>
      </CardContent>
    </Card>
  )
}
