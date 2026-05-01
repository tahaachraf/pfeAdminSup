import { useState } from "react";
import { useLocation } from "wouter";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Loader2 } from "lucide-react";
import type { SupplierCreePar } from "@/data/mockData";

function creeParLabel(creePar: SupplierCreePar | string | undefined): string {
  if (!creePar) return "—";
  if (typeof creePar === "string") return creePar;
  return `${creePar.prenom} ${creePar.nom}`.trim();
}

export default function FournisseursList() {
  const { suppliers, suppliersLoading } = useData();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.nom.toLowerCase().includes(q) ||
      (f.email ?? "").toLowerCase().includes(q) ||
      (f.tel ?? "").toLowerCase().includes(q) ||
      (f.siteWeb ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
          <p className="text-muted-foreground mt-2">Gérez votre liste de fournisseurs.</p>
        </div>
        <button
          onClick={() => setLocation("/fournisseurs/nouveau")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          data-testid="button-create-supplier"
        >
          <Plus size={16} />
          Créer un fournisseur
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un fournisseur..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="input-search"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Site web</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead>Créé par</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliersLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 size={20} className="animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun fournisseur trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((f) => (
                <TableRow
                  key={f._id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setLocation(`/fournisseurs/${f._id}`)}
                  data-testid={`row-supplier-${f._id}`}
                >
                  <TableCell className="font-medium text-indigo-600 hover:underline">{f.nom}</TableCell>
                  <TableCell>{f.tel || "—"}</TableCell>
                  <TableCell>{f.email || "—"}</TableCell>
                  <TableCell>{f.siteWeb || "—"}</TableCell>
                  <TableCell className="text-gray-500">
                    {f.dateCreation ? new Date(f.dateCreation).toLocaleDateString("fr-FR") : "—"}
                  </TableCell>
                  <TableCell className="text-gray-500">{creeParLabel(f.creePar)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
