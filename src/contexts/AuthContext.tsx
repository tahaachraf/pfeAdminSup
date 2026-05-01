import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/lib/api";

export interface AuthUser {
  _id: string;
  nom: string;
  prenom?: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, motDePasse: string) => {
    setLoading(true);
    try {
      const data = await api.post<AuthUser>("/auth/login", {
        email,
        motDePasse,
        role: "superAdmin",
      });
      if (data.role !== "superAdmin") {
        throw new Error("Accès refusé : rôle insuffisant.");
      }
      setUser(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
