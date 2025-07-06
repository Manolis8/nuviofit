import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Lock, Bell, Shield, Trash2, LogOut, Edit3, Save, X, ArrowLeft, AlertTriangle } from "lucide-react"
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
import { useEffect} from "react"
import { supabase } from "@/components/lib/supabaseClient";
import { useClerk } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react"; 
import { getMessagesLeft } from "@/components/lib/getMessagesLeft"
import { useAutoRenewMessages } from "@/components/lib/useAutoRenewMessages"
import React  from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";





export default function UserInfoPage() {
  const navigate = useNavigate()
  const { user, isSignedIn, isLoaded } = useUser();

  const [username, setUsername] = useState('');
  const [available, setAvailable] = useState<null | boolean>(null);

    useEffect(() => {
    if (username.length < 3) {
      setAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/check-username?username=${username}`);
      const data = await res.json();
      setAvailable(!data.exists);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
const [isValidDisplayName, setIsValidDisplayName] = useState(true);
const [usernameError, setUsernameError] = useState("");
const [isSaving, setIsSaving] = useState(false); // already present in your code
const [originalUsername, setOriginalUsername] = useState(user?.username || "");
const [usernameAvailability, setUsernameAvailability] = useState<"available" | "taken" | "checking" | null>(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    joinDate: "",
    lastLogin: "",
  })

const { lastResetAt } = useAutoRenewMessages(user?.id ?? "");


useEffect(() => {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500); // wait for page + animation to fully load
  }
}, []);

  const nextRenewalDate = lastResetAt ? addDays(lastResetAt, 30) : null;

      const {signOut} = useAuth();
      const email = user?.primaryEmailAddress?.emailAddress || "Unknown";
  const [displayName, setDisplayName] = useState(
  user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "User"
);
const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [joinDate, setJoinDate] = useState("Loading...");
const { session } = useClerk();

const [newEmail, setNewEmail] = useState("");
const [emailStatus, setEmailStatus] = useState("");
const [usernameCheckStatus, setUsernameCheckStatus] = useState<"available" | "taken" | "checking" | null>(null);

const [newPassword, setNewPassword] = useState("");
const [passwordStatus, setPasswordStatus] = useState("");

const [statusMessage, setStatusMessage] = useState("");
const [emailFormVisible, setEmailFormVisible] = useState(false);
const [passwordFormVisible, setPasswordFormVisible] = useState(false);

// Validation logic
const isPasswordLengthValid = newPassword.length >= 8;
const isPasswordStrengthValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword);
  const [reauthNeeded, setReauthNeeded] = useState(false);
  const [retryAction, setRetryAction] = useState<null | (() => Promise<void>)>(null);
    const [messagesLeft, setMessagesLeft] = useState<number | null>(null);
      const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1); // next month



const handleReauthClick = async () => {
  await signOut();  
};



  useEffect(() => {
      if (!isLoaded || !user) return;
  
      async function fetchMessages() {
        const count = await getMessagesLeft(user.id);
        setMessagesLeft(count);
      }
  
      fetchMessages();
    }, [isLoaded, user]);

type ClerkWithReauth = ReturnType<typeof useClerk> & {
  openReauthentication?: () => Promise<void>;
};

const clerk = useClerk() as ClerkWithReauth;
const openReauthentication = clerk.openReauthentication;

const handleReauthRequired = (failedAction) => {
  setRetryAction(() => failedAction);
  setReauthNeeded(true);
};

const performReauthentication = async () => {
  try {
    if (!openReauthentication) {
      await clerk.signOut();
      return;
    }

    await openReauthentication();
    setReauthNeeded(false);

    if (retryAction) {
      await retryAction();
      setRetryAction(null);
    }

    // Redirect after successful reauth & retry:
    navigate("/user-info", { replace: true });
  } catch (error) {
    console.error("Reauthentication failed or canceled", error);
    alert("Reauthentication failed. Please try again.");
  }
};

const checkUsernameAvailability = async (username: string) => {
  try {
    const res = await fetch(`/api/check-username?username=${username}`);
    const data = await res.json();
    return data.exists ? "taken" : "available";
  } catch (error) {
    console.error("Error checking username:", error);
    return null;
  }
};



useEffect(() => {
  const checkUsername = async () => {
    const username = userData.username.trim().toLowerCase();

    if (username.length < 4 || username.length > 30) {
      setIsValidDisplayName(false);
      setUsernameAvailability(null);
      setUsernameError("Username must be between 4 and 30 characters.");
      return;
    }

    setIsValidDisplayName(true);
    setUsernameError("");
    setUsernameAvailability("checking");

    const status = await checkUsernameAvailability(username);

    if (status === "taken") {
      setUsernameAvailability("taken");
      setUsernameError("Username is already taken.");
    } else if (status === "available") {
      setUsernameAvailability("available");
      setUsernameError("");
    } else {
      setUsernameAvailability(null);
      setUsernameError("Error checking username. Try again.");
    }
  };

  if (isEditing && userData.username.trim()) {
    const timeout = setTimeout(() => {
      checkUsername();
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }
}, [userData.username, isEditing]);




const handleChangeUsername = async (newUsername) => {
  setIsSaving(true);
  try {
    await clerk.user.update({ username: newUsername });
    alert("Username updated!");
    setIsEditing(false);
    setUsernameError("");
    setUsernameAvailability(null);
  } catch (e) {
    const msg = e?.message || "";

    if (
      msg.includes("additional verification") ||
      e?.errors?.[0]?.code === "session_verification_required"
    ) {
      handleReauthRequired(() => handleChangeUsername(newUsername));
    } else if (
      e?.errors?.[0]?.message?.includes("reserved") ||
      e?.errors?.[0]?.message?.includes("taken")
    ) {
      setUsernameError("Username is already taken.");
      setUsernameAvailability("taken");
    } else {
      console.error("Update error:", e);
      alert("Failed to change username");
    }
  } finally {
    setIsSaving(false);
  }
};



const handlePasswordChange = async (newPassword) => {
  try {
    await clerk.user.updatePassword({ newPassword });
    alert("Password updated!");
    setPasswordFormVisible(false);
    setNewPassword("");
  } catch (e) {
    if (e.message.includes("additional verification")) {
      // Set the retry action so we can call it again after reauth:
      handleReauthRequired(() => handlePasswordChange(newPassword));
      // Immediately prompt user for reauth:
      await performReauthentication();
    } else {
      console.error(e);
      alert("Failed to change password");
    }
  }
};




const handleDeleteAccount = async () => {
  try {
    // 1. Delete user row from Supabase
    const { error } = await supabase
      .from("onboarding_responses")
      .delete()
      .eq("user_id", clerk.user.id);

    if (error) throw new Error("Failed to delete Supabase data");

    // 2. Delete user from Clerk
    await clerk.user.delete();

    // 3. Sign out and navigate home
    await clerk.signOut();
    navigate("/");

    alert("Account deleted!");
  } catch (e) {
    if (
      e.message.includes("additional verification") || // Clerk may throw this string
      e?.errors?.[0]?.code === "session_verification_required" // Clerk may use this code
    ) {
      handleReauthRequired(() => handleDeleteAccount());
    } else {
      console.error("Deletion failed:", e);
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
    setOriginalUsername(user.username || "");
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


useEffect(() => {
  setDisplayName(
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "User"
  );
}, [user]);

const { redirectToSignIn } = useClerk();

const handleLogout = async () => {
  try {
    await signOut(); // Clerk sign out
    console.log("Logging out...");
    navigate("/auth");  // <-- This goes to "/auth" but you want "/auth/login"
  } catch (err) {
    console.error("Logout error:", err);
  }
};


const { signIn, setActive: setSignInActive } = useSignIn();

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const loginForm = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});


type LoginFormValues = z.infer<typeof loginSchema>;


  return (
    <>
    <style>{`
  @media (max-width: 450px) {
    .hide-avatar-on-mobile {
      display: none !important;
    }
  }
    html {
  scroll-behavior: smooth;
}
    @media (max-width: 320px) {
    .hide-icon-on-tiny {
      display: none !important;
    }
  }
    @media (max-width: 370px) {
    .hide-password-label {
      display: none !important;
    }
  }

  @media (max-width: 375px) {
    .hide-delete-description {
      display: none !important;
    }
  }
      @media (max-width: 370px) {
    .hide-on-small {
      display: none !important;
    }
  }
`}</style>

      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-emerald-950/30 pt-4 pb-20 md:pb-4">
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
          {/* Header */}
<motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="border-none shadow-lg mb-8">
<CardHeader>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      {/* 👇 Only the avatar gets hidden */}
      <div className="hide-avatar-on-mobile">
        <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
          <AvatarImage src="/placeholder.svg?height=64&width=64" />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white text-xl font-bold">
            {userData.firstName[0]}
            {userData.lastName[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 👇 This part stays visible */}
      <div>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </div>
    </div>

    {!isEditing && (
<Button variant="outline" onClick={() => setIsEditing(true)}>
  <Edit3 className="w-4 h-4 mr-2 hide-icon-on-tiny" />
  Edit
</Button>
    )}
  </div>
</CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
<Input
  value={userData.username}
  onChange={(e) => {
    const newUsername = e.target.value;
    setUserData((prev) => ({ ...prev, username: newUsername }));

    // Reset states
    setUsernameError("");
    setUsernameAvailability(null);

    // Update validity state for local UI check
    const isValid = newUsername.length >= 4 && newUsername.length <= 30;
    setIsValidDisplayName(isValid);
  }}
  onBlur={async () => {
    const newUsername = userData.username.trim();

    // Skip if unchanged or invalid
    if (
      !newUsername ||
      newUsername.length < 4 ||
      newUsername.length > 30 ||
      newUsername === originalUsername
    ) {
      setUsernameAvailability(null);
      setUsernameError("");
      return;
    }

    // Show loading state
    setUsernameAvailability("checking");

    try {
      const res = await fetch(`/api/check-username?username=${newUsername}`);
      const data = await res.json();

      if (data.exists === true) {
        setUsernameAvailability("taken");
        setUsernameError("Username is already taken.");
      } else if (data.exists === false) {
        setUsernameAvailability("available");
        setUsernameError("");
      } else {
        setUsernameAvailability(null);
        setUsernameError("Unexpected response. Try again.");
      }
    } catch (err) {
      setUsernameAvailability(null);
      setUsernameError("Error checking username. Try again.");
    }
  }}
  maxLength={30}
  disabled={!isEditing}
  className={cn(
    !isEditing ? "bg-gray-50" : "",
    usernameError && "border-red-500"
  )}
/>

{/* Availability messages */}
{usernameAvailability === "checking" && (
  <p className="text-gray-500 text-sm mt-1">Checking availability...</p>
)}

{usernameAvailability === "available" && (
  <p className="text-green-600 text-sm mt-1">✅ Username is available</p>
)}

{usernameAvailability === "taken" && (
  <p className="text-red-500 text-sm mt-1">❌ Username is taken</p>
)}

{/* Validation errors */}
{!isValidDisplayName && isEditing && (
  <p className="text-sm text-red-500 mt-1">
    Username must be between 4 and 30 characters.
  </p>
)}

{usernameError && usernameAvailability !== "taken" && (
  <p className="text-sm text-red-500 mt-1">{usernameError}</p>
)}

              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="p-3 bg-gray-50 rounded-md text-gray-700">
                  {userData.joinDate}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
<Button
  onClick={() => handleChangeUsername(userData.username)}
  disabled={
    !!usernameError ||
    usernameAvailability === "taken" ||
    !isValidDisplayName ||
    isSaving
  }
  className={cn(
    "bg-green-600 hover:bg-green-700",
    (!!usernameError || usernameAvailability === "taken" || isSaving) &&
      "opacity-50 pointer-events-none"
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


          {/* Security */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  <Card className="border-none shadow-lg mb-8">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Security
      </CardTitle>
      <CardDescription>Manage your password settings</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900 hide-password-label">Password</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPasswordFormVisible(!passwordFormVisible)}
          >
            Change Password
          </Button>
        </div>

        {passwordFormVisible && (
          <div className="mt-4 space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border rounded pr-10"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-xl text-gray-500 select-none"
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>

            {!isPasswordLengthValid && newPassword.length > 0 && (
              <p className="text-sm text-red-500">
                Password must be at least 8 characters.
              </p>
            )}
            {!isPasswordStrengthValid && newPassword.length > 0 && (
              <p className="text-sm text-red-500">
                Password must include at least one uppercase letter, one lowercase letter, and one number.
              </p>
            )}

            <Button
              size="sm"
              onClick={() => handlePasswordChange(newPassword)}
              disabled={!isPasswordLengthValid || !isPasswordStrengthValid}
            >
              Save Password
            </Button>
          </div>
        )}

        {statusMessage && (
          <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
            {statusMessage}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
</motion.div>

<section id="ai-messages">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <Card className="border-none shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📩 AI Messages
        </CardTitle>
        <CardDescription>Manage your chatbot message quota</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium text-gray-900">
                You have 📩{" "}
                <span className="text-indigo-600 font-semibold">{messagesLeft} messages left</span>
              </p>
              <p className="text-sm text-gray-500">
                Use them wisely to chat with your AI cat bot!
              </p>
              {nextRenewalDate && (
                <p>Renewal date: {nextRenewalDate.toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
</section>


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
  <div className="hide-on-small">
    <p className="font-medium text-red-900">Delete Account</p>
    <p className="text-sm text-red-700">
      Permanently delete your account and all data
    </p>
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-md p-6 max-w-sm w-full shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Reauthentication Required</h2>
      <p className="mb-6">
        For security reasons, please verify your identity to continue.<br /><br />
        Please follow these steps:<br />
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Click the <strong>Reauthenticate</strong> button below.</li>
          <li> Click <strong>Login</strong> in the homepge</li>
          <li>Log in again with your email and password.</li>
          <li>After successful login, go to <strong>Profile</strong> page.</li>
          <li>Then click <strong>Edit Profile Information</strong> to updating your information.</li>
          <li>Note: This reauthentication is valid for about 5 minutes.</li>
        </ol>
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setReauthNeeded(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleReauthClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reauthenticate
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </>
  )
}
