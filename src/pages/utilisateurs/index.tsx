import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Loader2 } from "lucide-react";
import { generateNumeroUtilisateur } from "@/lib/utils";

const roleLabel: Record<string, string> = {
  client: "Client",
  internaute: "Internaute",
  superAdmin: "Super Admin",
  adminMarketing: "Admin Marketing",
  adminAchat: "Admin Achat",
};

const roleBadge: Record<string, string> = {
  client: "bg-gray-100 text-gray-700",
  internaute: "bg-blue-50 text-blue-700",
  superAdmin: "bg-red-50 text-red-700",
  adminMarketing: "bg-purple-50 text-purple-700",
  adminAchat: "bg-orange-50 text-orange-700",
};

type FilterKey = "tous" | "admins" | "clients" | "internautes";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "tous",        label: "Tous" },
  { key: "admins",      label: "Admins" },
  { key: "clients",     label: "Clients" },
  { key: "internautes", label: "Internautes" },
];

const ADMIN_ROLES = new Set(["superAdmin", "adminMarketing", "adminAchat"]);

function matchesFilter(role: string, filter: FilterKey): boolean {
  if (filter === "tous") return true;
  if (filter === "admins") return ADMIN_ROLES.has(role);
  if (filter === "clients") return role === "client";
  if (filter === "internautes") return role === "internaute";
  return true;
}

export default function UtilisateursList() {
  const { users, usersLoading } = useData();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("tous");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      (u.nom ?? "").toLowerCase().includes(q) ||
      (u.prenom ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u._id && generateNumeroUtilisateur(users, u._id).toLowerCase().includes(q));
    return matchSearch && matchesFilter(u.role, activeFilter);
  });

  const countFor = (key: FilterKey) =>
    users.filter((u) => matchesFilter(u.role, key)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">Gérez les accès et les clients.</p>
        </div>
        <button
          onClick={() => setLocation("/utilisateurs/nouveau")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          data-testid="button-create-user"
        >
          <Plus size={16} />
          Créer un utilisateur
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="input-search"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {FILTERS.map(({ key, label }) => {
            const count = countFor(key);
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                data-testid={`filter-${key}`}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {usersLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Chargement des utilisateurs…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Utilisateur</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date création</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => {
                  const numero = u._id ? generateNumeroUtilisateur(users, u._id) : "—";
                  return (
                    <TableRow
                      key={u._id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setLocation(`/utilisateurs/${u._id}`)}
                      data-testid={`row-user-${u._id}`}
                    >
                      <TableCell>
                        <span className="font-semibold text-indigo-600 hover:underline">
                          {numero}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{u.nom || <span className="text-gray-300 italic">—</span>}</TableCell>
                      <TableCell>{u.prenom || <span className="text-gray-300 italic">—</span>}</TableCell>
                      <TableCell className="text-gray-500">{u.email || <span className="text-gray-300 italic">—</span>}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${roleBadge[u.role] ?? "bg-gray-100 text-gray-700"}`}>
                          {roleLabel[u.role] ?? u.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">{u.dateCreation ?? "—"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
