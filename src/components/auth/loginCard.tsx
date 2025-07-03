import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import  LoginForm  from "./loginForm";

export function LoginCard() {
  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-title">Welcome Back David</CardTitle>
        <CardDescription>
          Sign in to access your admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}