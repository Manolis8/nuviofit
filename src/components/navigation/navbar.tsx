import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Menu, X, Sparkles, Lock, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠", tooltip: "Your fitness overview", locked: false },
  { href: "/workout-page", label: "Workout", icon: "💪", tooltip: "Exercise plans & sessions", locked: false },
  { href: "/nutrition", label: "Nutrition", icon: "🍽️", tooltip: "Meal plans & tracking", locked: true },
  { href: "/mindset", label: "Mindset", icon: "🧘", tooltip: "Meditation & wellness", locked: true },
  { href: "/goals", label: "Goals", icon: "🎯", tooltip: "Track your progress", locked: true },
  { href: "/calendar", label: "Calendar", icon: "📅", tooltip: "Schedule & planning", locked: false },
  { href: "/profile", label: "Profile", icon: "👤", tooltip: "Account settings", locked: false },
]

export function Navbar() {
  const { pathname } = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showCompactNav, setShowCompactNav] = useState(false)

useEffect(() => {
  const handleResize = () => {
    setShowCompactNav(window.innerWidth < 1108) // Tailwind 'md' breakpoint
  }

  // Call on mount to set initial value
  handleResize()

  // Listen to resize
  window.addEventListener("resize", handleResize)

  return () => window.removeEventListener("resize", handleResize)
}, [])

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm dark:bg-gray-950/95 dark:border-gray-800"
            : "bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-gray-950/90 dark:border-gray-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Nuviofit
              </span>
            </Link>

            {/* Navigation Links - Full or Compact */}
            <div className="flex items-center space-x-1">
              {showCompactNav ? (
                // Compact dropdown menu
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    <Menu className="h-4 w-4" />
                    <span>Menu</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg dark:bg-gray-950/95 dark:border-gray-800"
                      >
                        <div className="p-2">
                          {navItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                isActive(item.href) && !item.locked
                                  ? "bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 text-gray-900"
                                  : item.locked
                                    ? "text-gray-400"
                                    : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <span>{item.icon}</span>
                              <span>{item.label}</span>
                              {item.locked && <Lock className="h-3 w-3 text-gray-400 ml-auto" />}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Full navigation
                <TooltipProvider delayDuration={0}>
                  {navItems.map((item) => (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.href}
                          className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? "bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 text-gray-900 dark:from-blue-950/50 dark:via-cyan-950/50 dark:to-emerald-950/50 dark:text-white"
                              : item.locked
                                ? "text-gray-400 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-500"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                          {item.locked && <Lock className="h-3 w-3 text-gray-400" />}
                          {isActive(item.href) && !item.locked && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 bg-gradient-to-r from-blue-100 via-cyan-100 to-emerald-100 rounded-full -z-10 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-emerald-900/30"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.locked ? "🔒 Coming soon!" : item.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-gray-950/90 dark:border-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Nuviofit
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/95 backdrop-blur-md border-t border-gray-200 dark:bg-gray-950/95 dark:border-gray-800"
            >
              <div className="px-4 py-4">
                <div className="space-y-2">
                  {[
                    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
                    { href: "/workout-page", label: "Workout", icon: "💪" },
                    { href: "/nutrition", label: "Nutrition", icon: "🍽️", locked: true },
                    { href: "/profile", label: "Profile", icon: "👤" },
                    { href: "/mindset", label: "Mindset", icon: "🧘", locked: true },
                    { href: "/goals", label: "Goals", icon: "🎯", locked: true },
                    { href: "/calendar", label: "Calendar", icon: "📅", locked: false },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.href) && !item.locked
                          ? "bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 text-gray-900"
                          : item.locked
                            ? "text-gray-400"
                            : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.locked && <Lock className="h-3 w-3 text-gray-400 ml-auto" />}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}
