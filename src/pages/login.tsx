import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        title: "Erreur de connexion",
        description: err?.message ?? "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "#0d1520" }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Admin<span style={{ color: "#3b82f6" }}>Super</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#8fa3bf" }}>
          Connectez-vous à votre espace
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Adresse email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="superadmin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-0 bg-blue-50 focus-visible:ring-blue-300 text-gray-800 placeholder:text-gray-400"
              required
              data-testid="input-email"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-0 bg-blue-50 focus-visible:ring-blue-300 text-gray-800"
              required
              data-testid="input-password"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
            disabled={isLoading}
            data-testid="button-login"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>

        </form>
      </div>
    </div>
  );
}
