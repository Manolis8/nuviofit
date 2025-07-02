import { useNavigate } from "react-router-dom"
import { Settings, User, Bell, Palette, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface SettingsProfileProps {
  onOpenSettings: () => void
}

export function SettingsProfile({ onOpenSettings }: SettingsProfileProps) {
    const navigate = useNavigate()
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚙️ Settings & Profile
        </CardTitle>
        <CardDescription>Customize your fitness experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Profile Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/user-info")}>
            <User className="w-4 h-4 mr-2" />
            Edit Profile Info
          </Button>
          
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/privacy-policy")}>
            <Info className="w-4 h-4 mr-2" />
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/terms-of-service")}>
            <Info className="w-4 h-4 mr-2" />
            Terms Of Service
          </Button>
        </div>

        {/* App Info */}
        <div className="pt-4 border-t text-center text-xs text-gray-500">
          <p>LifeSpark AI v2.1.0</p>
          <p>© 2025 LifeSpark </p>
        </div>
      </CardContent>
    </Card>
  )
}
