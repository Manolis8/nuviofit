"use client"

import { useState } from "react"
import { Heart, Activity, Moon, Lock, Crown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SmartwatchSync() {
  const [isConnected] = useState(false) // Always false for MVP

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⌚ Smartwatch Sync
          <Lock className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <CardDescription>Connect your wearable device to track steps, sleep, and more</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Locked Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Premium Feature</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">🔒 Locked - Coming with Pro Tier</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            2026
          </Badge>
        </div>

        {/* Preview Features */}
        <div className="space-y-3 opacity-60">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Coming Soon:</h4>

          {/* Device Options */}
          <div className="grid gap-2">
            {[
              { name: "Apple Watch", icon: "⌚", popular: true },
              { name: "Fitbit", icon: "📱", popular: true },
              { name: "Garmin", icon: "🏃", popular: false },
              { name: "Samsung Galaxy Watch", icon: "⌚", popular: false },
            ].map((device, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{device.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-500 dark:text-gray-400">{device.name}</p>
                    <p className="text-xs text-gray-400">{device.popular ? "Popular choice" : "Advanced features"}</p>
                  </div>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Heart className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Heart Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Activity className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Steps</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Moon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-400">--</p>
              <p className="text-xs text-gray-400">Sleep</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 text-white">
          <Crown className="h-4 w-4 mr-2" />
          Coming with Pro Tier in 2026
        </Button>
      </CardContent>
    </Card>
  )
}
