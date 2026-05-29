import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import {
  Home,
  Box,
  Folder,
  Users,
  ShoppingCart,
  Truck,
  Tag,
  Layers,
  FileText,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/dashboard", label: "Tableau de bord", icon: Home },
    { href: "/produits", label: "Produits", icon: Box },
    { href: "/categories", label: "Catégories", icon: Folder },
    { href: "/utilisateurs", label: "Utilisateurs", icon: Users },
    { href: "/commandes", label: "Commandes", icon: ShoppingCart },
    { href: "/fournisseurs", label: "Fournisseurs", icon: Truck },
    { href: "/marques", label: "Marques", icon: Tag },
    { href: "/modeles", label: "Modèles", icon: Layers },
    { href: "/devis", label: "Devis", icon: FileText },
  ];

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-full shrink-0 border-r border-sidebar-border">
      <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight bg-sidebar-accent/30 border-b border-sidebar-border">
        adminSuper
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = location.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5 opacity-90" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
