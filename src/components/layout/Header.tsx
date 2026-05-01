import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";

export function Header() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="font-medium text-lg">
        {/* We can put a title here based on the route, but keeping it simple */}
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm font-medium text-foreground">
            {user.prenom} {user.nom}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </header>
  );
}
