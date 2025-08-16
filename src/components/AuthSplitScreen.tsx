import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useSignUp, useClerk, useSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// Define validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must include at least one uppercase letter, one lowercase letter, and one number"
    ),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms of service",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthSplitScreen = () => {
const location = useLocation();

const initialTab =
  location.pathname.includes("/login") ? "login" :
  location.pathname.includes("/sign-up") ? "signup" :
  "login";

const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
const navigate = useNavigate()

useEffect(() => {
  if (location.pathname === "/auth" || location.pathname === "/auth/") {
    navigate(`/auth/${initialTab}`, { replace: true });
  }
}, [location.pathname, navigate, initialTab]);



const { isLoaded, isSignedIn } = useAuth();

useEffect(() => {
  if (isLoaded && isSignedIn) {
    navigate("/dashboard");
  }
}, [isLoaded, isSignedIn]);


  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { signIn, setActive: setSignInActive } = useSignIn();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");

  // Setup forms with validation
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      termsAccepted: false,
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
  if (isSignedIn) {
    navigate("/dashboard");
    return;
  }

  try {
    const result = await signIn.create({
      identifier: data.email,
      password: data.password,
    });

    if (result.status === "complete") {
      await setSignInActive({ session: result.createdSessionId });
      navigate("/dashboard");
    } else {
      alert("Login incomplete");
    }
  } catch (err: any) {
    alert("Login failed: " + (err.errors?.[0]?.message || err.message));
  }
};
  

const onSignupSubmit = async (data: SignupFormValues) => {
  setIsSubmitting(true); // Start loading

  try {
    await signUp.create({
      emailAddress: data.email,
      password: data.password,
    });

    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

    setEmailForVerification(data.email);
    setPendingVerification(true);
  } catch (err: any) {
    alert("Signup failed: " + (err.errors?.[0]?.message || err.message));
  } finally {
    setIsSubmitting(false); // Stop loading
  }
};

  
  const onVerifySignupCode = async (code: string) => {
  try {
    const result = await signUp.attemptEmailAddressVerification({ code });

    if (result.status === "complete" && result.createdSessionId) {
      await setSignUpActive({ session: result.createdSessionId });
      navigate("/getting-started"); // ✅ Redirect to onboarding
    } else {
      console.log("Result:", result);
      alert("Verification incomplete. Please try again or check your email again.");
    }
  } catch (err: any) {
    alert("Verification error: " + (err.errors?.[0]?.message || err.message));
  }
};
  const [verifying, setVerifying] = useState(false);


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-wellness-background">
      {/* Left side - Motivational Quote for desktop view */}
      <div className={`hidden lg:flex lg:w-1/2 p-6 md:p-12 items-center justify-center ${activeTab === "login" ? "order-2" : "order-1"}`}>
        <div className="max-w-md text-center">
          {activeTab === "signup" ? (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-3xl font-bold">Join the Movement ✨</h2>
              <p className="text-lg text-muted-foreground">
                Start your wellness journey today and become part of a community that transforms lives.
                Together we're stronger! 💪
              </p>
              <div className="h-1 w-16 bg-wellness-teal mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
              <p className="text-lg text-muted-foreground">
                Continue your wellness journey. Your goals and progress are waiting for you!
                Let's keep making progress together. 🌱
              </p>
              <div className="h-1 w-16 bg-wellness-lavender mx-auto"></div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 flex items-center justify-center order-2">
        <Card className="w-full max-w-md p-6 md:p-8 shadow-lg bg-white/95 backdrop-blur">
          {/* Mobile motivational quote */}
          <div className="lg:hidden mb-6 text-center">
            {activeTab === "signup" ? (
              <div className="space-y-2 animate-fade-in">
                <h2 className="text-2xl font-bold">Join the Movement ✨</h2>
                <p className="text-sm text-muted-foreground">
                  Start your wellness journey today! 💪
                </p>
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in">
                <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
                <p className="text-sm text-muted-foreground">
                  Continue your wellness journey! 🌱
                </p>
              </div>
            )}
          </div>

<Tabs
  value={activeTab}
  onValueChange={(v) => {
    setActiveTab(v as "login" | "signup");
    navigate(`/auth/${v}`, { replace: true });

    // Reset verification state
    setPendingVerification(false);
    setEmailForVerification("");
  }}
  className="w-full"
>


            <TabsList className="grid grid-cols-2 mb-8 w-full">
              <TabsTrigger value="signup" className="text-center">Sign Up</TabsTrigger>
              <TabsTrigger value="login" className="text-center">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="signup" className="space-y-6 animate-fade-in">

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                </div>
              </div>
              
              {/* Form */}
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
  control={signupForm.control}
  name="password"
  render={({ field }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...field}
              className="pr-10"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-xl text-gray-500"
              role="button"
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>

                  {/* Terms of Service Checkbox */}
                  <FormField
                    control={signupForm.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I accept the terms of service and privacy policy
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div id="clerk-captcha" className="mt-4" />

<Button
  type="submit"
  className="w-full bg-wellness-teal hover:bg-wellness-teal/90 mt-6"
  disabled={isSubmitting}
>
  {isSubmitting ? "Loading..." : "Create Account"}
</Button>

                </form>
              </Form>
              {pendingVerification && (
               <form
                onSubmit={(e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const code = formData.get("code") as string;
                 onVerifySignupCode(code);
                 }}
                 className="space-y-4 mt-6"
               >
                <label className="block text-sm font-medium text-gray-700">
                 Enter the 6-digit code sent to <strong>{emailForVerification}</strong>
                </label>

                <Input
                 name="code"
                 placeholder="Enter code"
                 className="border p-2 w-full max-w-sm"
                />

                <Button
  type="submit"
  disabled={verifying}
  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
>
  {verifying ? "Verifying..." : "Verify and Continue"}
</Button>


               </form>
              )}

              {/* Terms of Service Links */}
<div className="text-center text-sm text-gray-500 mt-4">
  <div className="flex justify-center space-x-4">
    <Link to="/terms-of-service" className="text-wellness-teal hover:underline">
      Terms of Service
    </Link>
    <Link to="/privacy-policy" className="text-wellness-teal hover:underline">
      Privacy Policy
    </Link>
  </div>
</div>


            </TabsContent>

            <TabsContent value="login" className="space-y-6 animate-fade-in">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500"></span>
                </div>
              </div>

              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
  control={loginForm.control}
  name="password"
  render={({ field }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...field}
              className="pr-10"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-xl text-gray-500"
              role="button"
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>

<div className="flex justify-end">
  <Link
    to="/forgot-password"
    className="text-sm text-wellness-lavender hover:text-wellness-lavender/90 hover:underline"
  >
    Forgot password?
  </Link>
</div>

<Button
  type="submit"
  className="w-full bg-wellness-lavender hover:bg-wellness-lavender/90"
>
  Log In
</Button>

                </form>
              </Form>
              
              {/* Terms of Service Links */}
              <div className="text-center text-sm text-gray-500 mt-4">
  <div className="flex justify-center space-x-4">
    <Link
      to="/terms-of-service"
      className="text-wellness-lavender hover:text-wellness-lavender/90 hover:underline"
    >
      Terms of Service
    </Link>
    <Link
      to="/privacy-policy"
      className="text-wellness-lavender hover:text-wellness-lavender/90 hover:underline"
    >
      Privacy Policy
    </Link>
  </div>
</div>

            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthSplitScreen;

