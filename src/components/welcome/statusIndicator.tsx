"use client";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type Status = "online" | "offline" | "checking";

export function StatusIndicator() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch {
        setStatus("offline");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    online: {
      icon: CheckCircle,
      text: "System Online",
      color: "text-green-500",
    },
    offline: {
      icon: AlertCircle,
      text: "System Offline",
      color: "text-red-500",
    },
    checking: {
      icon: Loader2,
      text: "Checking...",
      color: "text-muted-foreground",
    },
  };

  const { icon: Icon, text, color } = statusConfig[status];

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon 
        className={`w-4 h-4 ${color} ${status === "checking" ? "animate-spin" : ""}`} 
      />
      <span>{text}</span>
    </div>
  );
}