
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Dumbbell, Utensils, CheckSquare, Bot, Settings } from "lucide-react";

type NavItemProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
};

const NavItem = ({ to, label, icon, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-primary text-white"
        : "hover:bg-gray-100 text-gray-700"
    }`}
  >
    <div className="text-xl">{icon}</div>
    <span className="font-medium">{label}</span>
  </Link>
);

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home /> },
    { path: "/mood", label: "Mood Tracker", icon: <Heart /> },
    { path: "/fitness", label: "Fitness Plan", icon: <Dumbbell /> },
    { path: "/nutrition", label: "Nutrition", icon: <Utensils /> },
    { path: "/goals", label: "Goal Tracker", icon: <CheckSquare /> },
    { path: "/aicoach", label: "AI Coach", icon: <Bot /> },
    { path: "/settings", label: "Settings", icon: <Settings /> },
  ];

  return (
    <div className="flex min-h-screen bg-wellness-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white p-4 shadow-sm">
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-bold text-primary">LifeSpark</h1>
          <p className="text-sm text-muted-foreground">Wellness AI</p>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              isActive={
                  currentPath === item.path ||
                  (item.path === "/dashboard" && currentPath === "/")
              }
            />
          ))}
        </nav>
        <div className="mt-auto p-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LifeSpark
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden">
        <nav className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 flex-1 ${
                (item.path === "/" ? (currentPath === "/" || currentPath === "/dashboard") : currentPath.startsWith(item.path))
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white shadow-sm p-4 md:p-6">
          <h1 className="text-2xl font-bold">{title}</h1>
        </header>
        <div className="p-4 md:p-6 pb-20 md:pb-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
