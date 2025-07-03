import { WelcomeCard } from "@/components/welcome/welcomeCard";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4 bg-slate-400">
    <WelcomeCard />
  </main>
  );
}