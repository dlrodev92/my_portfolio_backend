import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "./actionButton";
import { StatusIndicator } from "./statusIndicator";

export function WelcomeCard() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-title mb-2 text-foreground">
          Portfolio Admin
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your projects, blogs, and content
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <ActionButton 
            href="/login"
            icon="LogIn"
            title="Login"
            description="Access your admin dashboard"
            variant="default"
          />
          
          <ActionButton 
            href="/dashboard"
            icon="LayoutDashboard"
            title="Dashboard"
            description="Go directly to admin panel"
            variant="outline"
          />
          
          <ActionButton 
            href="/api/health"
            icon="Activity"
            title="Health Check"
            description="Check system status"
            variant="ghost"
            external
          />
        </div>
        
        <div className="pt-4 border-t">
          <StatusIndicator />
        </div>
      </CardContent>
    </Card>
  );
}