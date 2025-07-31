import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/loginCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 bg-slate-400">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <LoginCard />
      </div>
    </main>
  );
}