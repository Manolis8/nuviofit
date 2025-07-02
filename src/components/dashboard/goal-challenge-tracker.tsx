import { useState } from "react"
import { Trophy, Target, Calendar, Users, Lock, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function GoalChallengeTracker() {
  const [showWaitlist, setShowWaitlist] = useState(false)

  return (
    <Card className="relative overflow-hidden">
  {/* Coming Soon Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
    <div className="text-center p-6">
      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">Coming Soon!</h3>
      <p className="text-gray-600 mb-4">Goals & Challenges feature is in development</p>
      <Button
        onClick={() => setShowWaitlist(true)}
        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600"
      >
        <Mail className="h-4 w-4 mr-2" />
        Join Beta Waitlist
      </Button>
    </div>
  </div>

  <CardHeader className="pb-3">
    <CardTitle className="flex items-center gap-2 text-lg">
      <Trophy className="h-5 w-5 text-yellow-500" />
      Goals & Challenges
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Current Goals */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Weekly Workout Goal</span>
        </div>
        <Badge variant="secondary">3/5</Badge>
      </div>
      <Progress value={60} className="h-2" />
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Daily Steps</span>
        </div>
        <Badge variant="secondary">8.2k/10k</Badge>
      </div>
      <Progress value={82} className="h-2" />
    </div>

    {/* Active Challenges */}
    <div className="pt-2 border-t">
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Users className="h-4 w-4 text-purple-500" />
        Active Challenges
      </h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
          <span className="text-sm">30-Day Consistency</span>
          <Badge variant="outline">Day 12</Badge>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
          <span className="text-sm">Summer Shred</span>
          <Badge variant="outline">Week 2</Badge>
        </div>
      </div>
    </div>
  </CardContent>

  {/* Waitlist Modal */}
  {showWaitlist && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Join Beta Waitlist</h3>
        <p className="text-gray-600 mb-4">Be the first to try our Goals & Challenges feature!</p>
        <div className="space-y-3">
          <input type="email" placeholder="Enter your email" className="w-full p-3 border rounded-lg" />
          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500">
              Join Waitlist
            </Button>
            <Button variant="outline" onClick={() => setShowWaitlist(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )}
</Card>

  )
}
