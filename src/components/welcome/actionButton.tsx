import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, Activity, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  LogIn,
  LayoutDashboard,
  Activity,
};

interface ActionButtonProps {
  href: string;
  icon: keyof typeof icons;
  title: string;
  description: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  external?: boolean;
  className?: string;
}

export function ActionButton({
  href,
  icon,
  title,
  description,
  variant = "default",
  external = false,
  className
}: ActionButtonProps) {
  const IconComponent = icons[icon];
  
  const buttonContent = (
    <Button 
      variant={variant} 
      className={cn("w-full h-12 justify-start gap-3", className)} 
      size="lg"
      asChild
    >
      <div className="flex items-center gap-3 w-full">
        <IconComponent className="w-5 h-5 shrink-0" />
        <div className="text-left flex-1">
          <div className="font-medium">{title}</div>
          <div className="text-xs opacity-70">{description}</div>
        </div>
        {external && <ExternalLink className="w-4 h-4 opacity-50" />}
      </div>
    </Button>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {buttonContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block">
      {buttonContent}
    </Link>
  );
}