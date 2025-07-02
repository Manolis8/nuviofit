import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Lock, Bell, Shield, Trash2, LogOut, Edit3, Save, X, ArrowLeft, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { useEffect} from "react"
import { supabase } from "@/components/lib/supabaseClient";
import { useClerk } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react"; 
import React  from "react";





export default function UserInfoPage() {
const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
    const { user, isLoaded} = useUser()
      const {signOut} = useAuth();
      const email = user?.primaryEmailAddress?.emailAddress || "Unknown";
  const [displayName, setDisplayName] = useState(
  user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "User"
);
const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const isValidDisplayName = displayName.length >= 4 && displayName.length <= 30;
  const [joinDate, setJoinDate] = useState("Loading...");
  const [usernameError, setUsernameError] = useState("");
const [isSaving, setIsSaving] = useState(false);
const { session } = useClerk();
const {clerk} = useClerk(); 
const [newEmail, setNewEmail] = useState("");
const [emailStatus, setEmailStatus] = useState("");

const [newPassword, setNewPassword] = useState("");
const [passwordStatus, setPasswordStatus] = useState("");

const [statusMessage, setStatusMessage] = useState("");
const [emailFormVisible, setEmailFormVisible] = useState(false);
const [passwordFormVisible, setPasswordFormVisible] = useState(false);


  const [reauthNeeded, setReauthNeeded] = useState(false);
  const [retryAction, setRetryAction] = useState<null | (() => Promise<void>)>(null);
  

 const handleReauthRequired = (failedAction) => {
    setRetryAction(() => failedAction);
    setReauthNeeded(true);
  };

const performReauthentication = async () => {
  try {
    // Older Clerk versions expose openReauthentication directly on the instance
    if (!clerk?.openReauthentication) {
      throw new Error("Reauthentication not supported. Update Clerk SDK.");
    }

    await clerk.openReauthentication();
    setReauthNeeded(false);

    if (retryAction) {
      await retryAction();
      setRetryAction(null);
    }
  } catch (error) {
    console.error("Reauthentication failed or canceled", error);
    alert("Reauthentication failed. Please try again.");
  }
};

  const handleEmailChange = async (newEmail) => {
    try {
      await clerk.user.createEmailAddress(newEmail);
      alert("Email updated!");
    } catch (e) {
      if (e.message.includes("additional verification")) {
        handleReauthRequired(() => handleEmailChange(newEmail));
      } else {
        console.error(e);
        alert("Failed to change email");
      }
    }
  };

  // Same pattern for other actions:
  const handleChangeUsername = async (newUsername) => {
    try {
      await clerk.user.update({ username: newUsername });
      alert("Username updated!");
    } catch (e) {
      if (e.message.includes("additional verification")) {
        handleReauthRequired(() => handleChangeUsername(newUsername));
      } else {
        console.error(e);
        alert("Failed to change username");
      }
    }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      await clerk.user.updatePassword(newPassword);
      alert("Password updated!");
    } catch (e) {
      if (e.message.includes("additional verification")) {
        handleReauthRequired(() => handlePasswordChange(newPassword));
      } else {
        console.error(e);
        alert("Failed to change password");
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete logic here (Clerk + Supabase)
      alert("Account deleted!");
    } catch (e) {
      if (e.message.includes("additional verification")) {
        handleReauthRequired(handleDeleteAccount);
      } else {
        console.error(e);
        alert("Failed to delete account");
      }
    }
  };

useEffect(() => {
  const fetchJoinDate = async () => {
    const { data, error } = await supabase
      .from('onboarding_responses')
      .select('created_at')
      .eq('user_id', user.id) // make sure you have the current user's ID
      .single();

    if (error) {
      console.error("Failed to fetch join date:", error);
      return;
    }

    const rawDate = data.created_at;

    const formatted = new Date(rawDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    setUserData((prev) => ({
      ...prev,
      joinDate: formatted,
    }));
  };

  if (user?.id) fetchJoinDate();
}, [user?.id]);

useEffect(() => {
  if (user) {
    setUserData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.primaryEmailAddress?.emailAddress || "",
    }));
  }
}, [user]);

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

  // User data state
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    joinDate: "",
    lastLogin: "",
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    progressUpdates: true,
    weeklyReports: true,
    marketingEmails: false,
    pushNotifications: true,
  })
useEffect(() => {
  setDisplayName(
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "User"
  );
}, [user]);

const { redirectToSignIn } = useClerk();

const handleSave = async () => {
  setIsSaving(true);
  try {
    await user.update({
      username: userData.username,
    });

    setIsEditing(false);
  } catch (e: any) {
    if (e.errors?.[0]?.code === "reverification_required") {
      // Just call redirectToSignIn, it will handle redirect for you
      redirectToSignIn({
        // optional options like redirectBackUrl
        // redirectBackUrl: window.location.pathname,
      });
    } else {
      console.error("Update failed:", e);
    }
  } finally {
    setIsSaving(false);
  }
};

  const handleLogout = async () => {
    try {
      await signOut(); // Clerk sign out
      console.log("Logging out...");
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-emerald-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button variant="outline" onClick={() => navigate("/profile")} className="mb-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage your account information and preferences</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active Account
              </Badge>
            </div>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-none shadow-lg mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                      <AvatarImage src="/placeholder.svg?height=64&width=64" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white text-xl font-bold">
                        {userData.firstName[0]}
                        {userData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                  </div>
{!isEditing && (
  <Button
    variant="outline"
    onClick={() => setIsEditing(true)}
  >
    <Edit3 className="w-4 h-4 mr-2" />
    Edit Profile
  </Button>
)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/*<div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
<Input
  value={userData.username}
  onChange={(e) =>
    setUserData({ ...userData, username: e.target.value })
  }
  maxLength={30}
  disabled={!isEditing}
  className={cn(
    !isEditing ? "bg-gray-50" : "",
    usernameError && "border-red-500"
  )}
/>
{usernameError && (
  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
)}

{!isValidDisplayName && isEditing && (
  <p className="text-sm text-red-500 mt-1">Username must be between 4 and 30 characters.</p>
)}

                  </div>
                  {/*<div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>*/}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="p-3 bg-gray-50 rounded-md text-gray-700">{userData.joinDate}</div>
                  </div>
                  {/*
                  <div className="space-y-2">
                    <Label>Last Login</Label>
                    <div className="p-3 bg-gray-50 rounded-md text-gray-700">{userData.lastLogin}</div>
                  </div>*/}
                </div>

                {isEditing && (
  <div className="flex gap-3 pt-4">
    <Button
      onClick={handleSave}
      disabled={!!usernameError || isSaving}
      className={cn(
        "bg-green-600 hover:bg-green-700",
        (!!usernameError || isSaving) && "opacity-50 pointer-events-none"
      )}
    >
      <Save className="w-4 h-4 mr-2" />
      {isSaving ? "Saving..." : "Save Changes"}
    </Button>
    <Button
      variant="outline"
      onClick={() => {
        setIsEditing(false);
        setUserData((prev) => ({
          ...prev,
          username: user?.username || "",
        }));
        setUsernameError("");
      }}
    >
      <X className="w-4 h-4 mr-2" />
      Cancel
    </Button>
  </div>
)}

              </CardContent>
            </Card>
          </motion.div>

          {/* Email & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-none shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Email & Security
                </CardTitle>
                <CardDescription>Manage your email and password settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{userData.email}</p>
                        <p className="text-sm text-gray-600">Primary email address</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setEmailFormVisible(!emailFormVisible)}>
  Change Email
</Button>

                  </div>
                  {emailFormVisible && (
  <div className="mt-4 space-y-2">
    <input
      type="email"
      className="w-full px-3 py-2 border rounded"
      placeholder="Enter new email"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
    />
    <Button size="sm" onClick={handleEmailChange}>
      Save Email
    </Button>
  </div>
)}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setPasswordFormVisible(!passwordFormVisible)}>
  Change Password
</Button>

                  </div>
                  {passwordFormVisible && (
  <div className="mt-4 space-y-2">
    <input
      type="password"
      className="w-full px-3 py-2 border rounded"
      placeholder="Enter new password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <Button size="sm" onClick={handlePasswordChange}>
      Save Password
    </Button>
  </div>
)}
{statusMessage && (
  <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">{statusMessage}</p>
)}

                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Preferences
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-none shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: "workoutReminders",
                    label: "Workout Reminders",
                    desc: "Get reminded about your scheduled workouts",
                  },
                  {
                    key: "progressUpdates",
                    label: "Progress Updates",
                    desc: "Weekly summaries of your fitness progress",
                  },
                  { key: "weeklyReports", label: "Weekly Reports", desc: "Detailed analytics and insights" },
                  {
                    key: "marketingEmails",
                    label: "Marketing Emails",
                    desc: "Product updates and promotional content",
                  },
                  {
                    key: "pushNotifications",
                    label: "Push Notifications",
                    desc: "Real-time notifications on your device",
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>*/}

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-none shadow-lg border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">Log Out</p>
                    <p className="text-sm text-red-700">Sign out of your account</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <LogOut className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold">Confirm Logout</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out? You'll need to sign in again to access your account.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleLogout} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-6 max-w-md w-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">Delete Account</h3>
      </div>
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          This action cannot be undone. This will permanently delete your account and remove all your data from
          our servers.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">What will be deleted:</p>
          <ul className="text-sm text-red-700 mt-2 space-y-1">
            <li>• All workout history and progress</li>
            <li>• Personal information and preferences</li>
            <li>• Achievements and statistics</li>
            <li>• Account settings and data</li>
          </ul>
        </div>
      </div>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="form-checkbox h-5 w-5 text-red-600"
        />
        <span className="text-gray-700 text-sm">
          I understand all of these and want to permanently delete my account.
        </span>
      </label>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="flex-1"
          disabled={!isConfirmed}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Forever
        </Button>
      </div>
    </motion.div>
  </div>
)}
{reauthNeeded && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-6 max-w-md w-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <Lock className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Reauthentication Required</h3>
      </div>
      <p className="text-gray-600 mb-6">
        To perform this action, please confirm your identity. Click the button below to verify.
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setReauthNeeded(false)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={performReauthentication}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Lock className="w-4 h-4 mr-2" />
          Reauthenticate Now
        </Button>
      </div>
    </motion.div>
  </div>
)}

      </div>
    </>
  )
}
