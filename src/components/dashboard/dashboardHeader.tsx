import Link from "next/link";
import { LayoutDashboard, FolderOpen, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Overview",
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
  return (
    <div className="w-64 bg-card border-r min-h-screen">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-title font-semibold">Portfolio Admin</span>
        </Link>
      </div>

      <nav className="px-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-10"
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start gap-3" asChild>
          <Link href="/">
            <LogOut className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}