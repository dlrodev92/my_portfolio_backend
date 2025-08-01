"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FolderOpen, FileText, LayoutDashboard, ChevronLeft, ChevronRight, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
  },
];

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={cn(
      "bg-card border-l min-h-screen transition-all duration-300 ease-in-out flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
     
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 animate-in slide-in-from-right duration-200">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-title font-semibold">Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

     
      <nav className="p-4 space-y-2 flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start gap-3"
                )}
                size={isCollapsed ? "icon" : "default"}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <span className="animate-in slide-in-from-right duration-200">
                    {item.title}
                  </span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full transition-all duration-200",
            isCollapsed ? "justify-center px-2" : "justify-start gap-3"
          )}
          size={isCollapsed ? "icon" : "default"}
        >
          <div className="w-4 h-4 shrink-0 relative">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
            <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
          </div>
          {!isCollapsed && (
            <span className="animate-in slide-in-from-right duration-200">
              Toggle Theme
            </span>
          )}
        </Button>

     
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "w-full transition-all duration-200",
            isCollapsed ? "justify-center px-2" : "justify-start gap-3"
          )}
          size={isCollapsed ? "icon" : "default"}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && (
            <span className="animate-in slide-in-from-right duration-200">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}