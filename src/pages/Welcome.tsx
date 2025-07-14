
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Heart, Dumbbell, Utensils, CheckSquare, 
  Watch, Sparkles, Zap, Flame, Award, Brain,
  BarChart, Smile, LayoutDashboard, Timer, Calendar,
  User, Users, Clock, LineChart, Settings, CircleCheck, Lightbulb, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WatchConnectModal from "@/components/WatchConnectModal";

const Welcome = () => {
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);

  // Features data
  const features = [
    {
      icon: <Heart className="text-wellness-peach h-6 w-6" />,
      title: "Mood Tracker",
      description: "AI analyzes your journal entries to detect emotions and provide personalized mood insights."
    },
    {
      icon: <Dumbbell className="text-wellness-blue h-6 w-6" />,
      title: "Fitness Plan",
      description: "Custom workout routines designed for your fitness level, goals, and available equipment."
    },
    {
      icon: <Utensils className="text-wellness-mint h-6 w-6" />,
      title: "Nutrition Coach",
      description: "AI-generated meal plans that match your dietary preferences, restrictions, and nutritional goals."
    },
    {
      icon: <Brain className="text-wellness-lavender h-6 w-6" />,
      title: "Meditation Tips",
      description: "Daily mindfulness exercises and meditation recommendations personalized for your mental state."
    },
    {
      icon: <CheckSquare className="text-wellness-teal h-6 w-6" />,
      title: "Goal Tracker",
      description: "Set, visualize, and achieve meaningful health goals with AI-powered progress insights."
    },
    {
      icon: <Award className="text-wellness-peach h-6 w-6" />,
      title: "Challenges",
      description: "Compete with friends or join community challenges to stay motivated and accountable."
    },
    {
      icon: <Watch className="text-wellness-blue h-6 w-6" />,
      title: "Device Sync",
      description: "Seamlessly connect your Fitbit, Apple Watch, or other devices for comprehensive health tracking."
    }
  ];

  // How it works steps
  const howItWorks = [
    {
      icon: <User className="text-wellness-blue h-6 w-6" />,
      title: "Sign Up",
      description: "Create your profile and connect your devices in less than 2 minutes."
    },
    {
      icon: <Sparkles className="text-wellness-peach h-6 w-6" />,
      title: "AI Plan",
      description: "Get your personalized wellness plan based on your goals and preferences."
    },
    {
      icon: <Calendar className="text-wellness-mint h-6 w-6" />,
      title: "Follow Daily",
      description: "Complete recommended activities and track your progress daily."
    },
    {
      icon: <LineChart className="text-wellness-lavender h-6 w-6" />,
      title: "Adapt & Improve",
      description: "Your plan evolves as you progress, always optimizing for your best results."
    }
  ];

  // Comparison table data
  const comparisonData = [
    {
      feature: "Personalized AI Recommendations",
      us: true,
      others: false
    },
    {
      feature: "Holistic Wellness Approach",
      us: true,
      others: false
    },
    {
      feature: "Emotion Detection & Mood Analysis",
      us: true,
      others: false
    },
    {
      feature: "Device Integration",
      us: true,
      others: true
    },
    {
      feature: "Adaptive Plans That Evolve",
      us: true,
      others: false
    },
    {
      feature: "Real-time Insights",
      us: true,
      others: false
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah M.",
      text: "I’ve lost 15 pounds since starting this program, and for the first time in years, I actually feel confident when I look in the mirror. It’s not just about the weight — I feel energized and more in control of my health.",
      avatar: "👩"
    },
    {
      name: "Michael T.",
      text: "The personalized fitness plans are amazing. They adjust perfectly to my progress and I've never been stronger.",
      avatar: "👨"
    },
    {
      name: "Jorge",
      text: "My kids keep telling me I look like a superhero now! I’ve gotten leaner, more toned, and I finally have the energy to keep up with them. This plan changed how my family sees me.",
      avatar: "👨"
    }
  ];
  
  // Results data with emojis
  const resultsData = [
    {
      emoji: "⚡",
      title: "Increased Energy",
      description: "85% of users report higher daily energy levels within 2 weeks"
    },
    {
      emoji: "😴",
      title: "Better Sleep",
      description: "Fall asleep 30% faster and enjoy deeper, more restful sleep"
    },
    {
      emoji: "💪",
      title: "Improved Strength",
      description: "Users gain an average of 12% more muscle mass in 3 months"
    },
    {
      emoji: "🧠",
      title: "Mental Clarity",
      description: "92% report improved focus and reduced brain fog"
    },
    {
      emoji: "❤️",
      title: "Heart Health",
      description: "Average resting heart rate decreased by 7 BPM after 6 weeks"
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar - New fixed navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-xl text-wellness-blue">Nuviofit</Link>
            </div>
            <div className="hidden md:flex space-x-4 items-center">
              <Link to="/about" className="hover:text-wellness-blue transition-colors">About Us</Link>
              <Button asChild variant="outline" className="ml-2">
                <Link to="/auth">Log In</Link>
              </Button>
              <Button asChild className="bg-wellness-blue hover:bg-wellness-blue/90">
                <Link to="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section - With padding top to account for navbar */}
      <section className="py-20 md:py-32 mt-16 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-sm">
              <Sparkles className="text-wellness-teal mr-2 h-5 w-5" />
              <span className="text-sm font-medium">AI-Powered Wellness Journey</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-wellness-teal via-wellness-blue to-wellness-lavender">
              Transform Your Mind 
              <br />
              and Body with Nuviofit
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-700 max-w-3xl">
              Join the movement of wellness revolutionaries changing how we approach health
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-wellness-teal to-wellness-blue hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                <Link to="/auth/sign-up">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <CircleCheck className="h-4 w-4 text-wellness-teal" />
              <span>No credit card required</span>
              <span className="mx-2">•</span>
              <CircleCheck className="h-4 w-4 text-wellness-teal" />
              <span>Free to get started</span>
            </div>

            {/* Feature icons row - Expanded with more feature icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="flex flex-col items-center">
                <div className="bg-red-100/70 rounded-full p-4 mb-3">
                  <Heart className="text-red-400 h-6 w-6" />
                </div>
                <p className="font-medium">Mood Tracking</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-100/70 rounded-full p-4 mb-3">
                  <Dumbbell className="text-blue-400 h-6 w-6" />
                </div>
                <p className="font-medium">Fitness Plans</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-100/70 rounded-full p-4 mb-3">
                  <Utensils className="text-green-400 h-6 w-6" />
                </div>
                <p className="font-medium">Nutrition Guide</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100/70 rounded-full p-4 mb-3">
                  <Watch className="text-purple-400 h-6 w-6" />
                </div>
                <p className="font-medium">Smartwatch Data</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-wellness-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-wellness-teal/10 rounded-full blur-3xl"></div>
      </section>
      
      {/* For Your Loved Ones Section */}
      <section className="py-16 bg-gradient-to-r from-wellness-lavender/20 to-wellness-blue/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Users className="text-wellness-peach mr-2 h-5 w-5" />
                <span className="text-sm font-medium">For Your Loved Ones</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                A Healthier You For Those Who Matter Most
              </h2>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-wellness-peach to-wellness-lavender rounded-full opacity-20 blur-lg"></div>
                    <div className="relative text-8xl flex items-center justify-center">
                      ❤️
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <p className="text-lg md:text-xl mb-6 italic font-light leading-relaxed">
                    "Your health journey isn't just about you. It's about being there—truly there—for the people you love. It's about having the energy to play with your children, the clarity to support your partner, and the vitality to enjoy life with your friends and family."
                  </p>
                  
                  <p className="text-lg md:text-xl mb-6">
                    When you invest in your health with Nuviofit, you're giving a gift not just to yourself, but to everyone who cares about you. You're promising them more quality time, more memorable moments, and a longer future together.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-8">
                    <div className="bg-wellness-peach/10 rounded-full px-4 py-2 text-sm font-medium text-wellness-peach">For your spouse</div>
                    <div className="bg-wellness-blue/10 rounded-full px-4 py-2 text-sm font-medium text-wellness-blue">For your children</div>
                    <div className="bg-wellness-teal/10 rounded-full px-4 py-2 text-sm font-medium text-wellness-teal">For your friends</div>
                    <div className="bg-wellness-mint/10 rounded-full px-4 py-2 text-sm font-medium text-wellness-mint">For your future self</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Inspirational Quote Section - Moved below For Your Loved Ones and simplified */}
      <section className="py-16 bg-gradient-to-r from-wellness-blue/5 to-wellness-peach/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="absolute -top-6 -left-6 text-6xl text-wellness-teal/20 font-serif">
              "
            </div>
            <div className="absolute -bottom-6 -right-6 text-6xl text-wellness-teal/20 font-serif">
              "
            </div>
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-700 italic">
              The greatest wealth is health. Nuviofit doesn't just track your wellness—it transforms it, 
              <span className="font-medium"> one personalized insight at a time</span>.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-1">
              <div className="h-1 w-1 rounded-full bg-wellness-teal"></div>
              <div className="h-1 w-1 rounded-full bg-wellness-blue"></div>
              <div className="h-1 w-1 rounded-full bg-wellness-peach"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Problem & Solution Section - Updated title */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Beyond Wellness Apps: Real Solutions for Real Health Challenges</h2>
              <p className="text-lg text-gray-600">
                We've identified key wellness obstacles and created innovative solutions to help you overcome them
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">The Problem</h3>
                <div className="bg-red-50 rounded-xl p-6 mb-8 border border-red-100">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                        <Zap size={16} className="text-red-500" />
                      </div>
                      <span>Generic wellness advice that doesn't adapt to your unique situation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                        <Zap size={16} className="text-red-500" />
                      </div>
                      <span>Multiple disconnected apps for tracking different aspects of health</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                        <Zap size={16} className="text-red-500" />
                      </div>
                      <span>No understanding of how your mood affects your physical health and vice versa</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                        <Zap size={16} className="text-red-500" />
                      </div>
                      <span>Lack of motivation and accountability to stick with health goals</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Our Solution</h3>
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <Sparkles size={16} className="text-green-500" />
                      </div>
                      <span>AI-powered personalized wellness plans that adapt to your progress</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <Sparkles size={16} className="text-green-500" />
                      </div>
                      <span>All-in-one platform for mental, physical, and nutritional health</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <Sparkles size={16} className="text-green-500" />
                      </div>
                      <span>Advanced emotion detection to help you understand your mood patterns</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <Sparkles size={16} className="text-green-500" />
                      </div>
                      <span>Community challenges and insights that keep you motivated</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Nuviofit combines cutting-edge artificial intelligence with the latest in behavioral science to create a wellness companion that truly understands <span className="font-semibold">you</span> — your preferences, your challenges, and your individual journey to better health.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* What Makes Us Different - Moved above How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-wellness-blue/10 rounded-full px-4 py-2 mb-4">
              <Lightbulb className="text-wellness-blue mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Our Advantage</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              See how Nuviofit compares to traditional health apps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Feature</TableHead>
                    <TableHead className="text-center">Nuviofit</TableHead>
                    <TableHead className="text-center">Other Health Apps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.feature}</TableCell>
                      <TableCell className="text-center">
                        {row.us ? (
                          <CheckSquare className="text-wellness-teal mx-auto" />
                        ) : (
                          <span className="text-red-500">✕</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.others ? (
                          <CheckSquare className="text-wellness-teal mx-auto" />
                        ) : (
                          <span className="text-red-500">✕</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 mb-6">
                Don't settle for generic health apps that treat everyone the same.
                <br />Experience the power of personalized AI wellness guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Section - Positioned after How It Works */}
      <section className="py-20 bg-gradient-to-b from-wellness-lavender/10 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-wellness-teal/10 rounded-full px-4 py-2 mb-4">
              <Users className="text-wellness-teal mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Join Our Community</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Be Part of The Wellness Revolution</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
              Nuviofit isn't just an app—it's a growing community of people committed to transforming their health and supporting each other along the way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="bg-wellness-peach/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-wellness-peach h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Daily Support</h3>
                <p className="text-gray-600">Connect with others who share your health goals and challenges</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="bg-wellness-mint/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="text-wellness-mint h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Weekly Challenges</h3>
                <p className="text-gray-600">Join fun community challenges that keep you motivated and accountable</p>
              </div>
            </div>
            
            <div className="mt-12">
              <Button asChild size="lg" className="bg-wellness-teal hover:bg-wellness-teal/90">
                <Link to="/dashboard">
                  Join Our Community <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights Section - MOVED TO APPEAR AFTER COMMUNITY SECTION */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-wellness-teal/10 rounded-full px-4 py-2 mb-4">
              <Sparkles className="text-wellness-teal mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need For Better Health</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered features works together to transform your health and wellness journey
            </p>
          </div>

          {/* Features carousel for mobile */}
          <div className="md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="border-none shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="flex flex-col items-center text-center p-6">
                          <div className="bg-gradient-to-br from-wellness-lavender/20 to-wellness-blue/20 rounded-full p-4 mb-4">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="static" />
                <CarouselNext className="static" />
              </div>
            </Carousel>
          </div>
          
          {/* Features grid for desktop */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px]">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="bg-gradient-to-br from-wellness-lavender/20 to-wellness-blue/20 rounded-full p-4 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-wellness-blue hover:bg-wellness-blue/90">
              <Link to="/auth/sign-up">
                Explore All Features
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* How It Works - MOVED BELOW POWERFUL FEATURES AND ABOVE SUCCESS STORIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-wellness-mint/10 rounded-full px-4 py-2 mb-4">
              <Clock className="text-wellness-mint mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How Nuviofit Works</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Getting started on your personalized wellness journey takes just minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {howItWorks.map((step, index) => (
                  <div key={index} className="relative z-10 flex flex-col items-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 h-full w-full flex flex-col items-center text-center">
                      <div className="bg-gradient-to-br from-wellness-blue/20 to-wellness-teal/20 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-xl font-bold text-wellness-blue">
                        {index + 1}
                      </div>
                      <div className="mb-4">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-wellness-mint to-wellness-teal hover:opacity-90 transition-all">
                <Link to="/auth/sign-up">
                  Start Your Journey Today
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials - MOVED BELOW HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-wellness-peach/10 rounded-full px-4 py-2 mb-4">
              <Heart className="text-wellness-peach mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Real Results from Real People</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              See how Nuviofit has transformed the lives of our users
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel opts={{ loop: true }} className="mb-8">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="border-none shadow-lg">
                        <CardContent className="p-8 text-center">
                          <div className="text-5xl mb-4">{testimonial.avatar}</div>
                          <p className="text-lg md:text-xl mb-6 italic">"{testimonial.text}"</p>
                          <p className="font-semibold">{testimonial.name}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="static" />
                <CarouselNext className="static" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-wellness-teal/20 via-wellness-blue/20 to-wellness-lavender/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Transform Your Life Today
            </h2>
            <p className="text-xl mb-8">
              Take the first step toward a healthier, happier you. Your future self—and the people who love you—will thank you for it.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-wellness-teal to-wellness-blue hover:opacity-90 transition-all shadow-md hover:shadow-lg">
              <Link to="/dashboard">
                Begin Your Wellness Journey <ArrowRight className="ml-2" />
              </Link>
            </Button>
            
            <div className="mt-8 text-sm text-gray-600">
              Join thousands of users already experiencing the Nuviofit difference
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Keep the existing footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nuviofit</h3>
              <p className="text-gray-400">Your personalized wellness companion powered by artificial intelligence.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link to="/mindset" className="text-gray-400 hover:text-white transition-colors">Mood Tracking</Link></li>
                <li><Link to="/workout-page" className="text-gray-400 hover:text-white transition-colors">Fitness Plans</Link></li>
                <li><Link to="/nutrition" className="text-gray-400 hover:text-white transition-colors">Nutrition Guide</Link></li>
                <li><Link to="/goals" className="text-gray-400 hover:text-white transition-colors">Goal Setting</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 013.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.01-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.045-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.353.137.882.3 1.857.344 1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Nuviofit. All rights reserved.</p>
            <p className="text-gray-400 mt-4 md:mt-0">Made with 💖 for a healthier world</p>
          </div>
        </div>
      </footer>

      <WatchConnectModal open={isWatchModalOpen} onOpenChange={setIsWatchModalOpen} />
    </div>
  );
};

export default Welcome;
