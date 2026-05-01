import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { generateNumeroCommande } from "@/lib/utils";

const statutBadge: Record<string, string> = {
  valide:      "bg-green-50 text-green-700",
  en_attente:  "bg-yellow-50 text-yellow-700",
  refuse:      "bg-red-50 text-red-700",
  rembourse:   "bg-gray-100 text-gray-600",
};

const statutLabel: Record<string, string> = {
  valide:     "Validé",
  en_attente: "En attente",
  refuse:     "Refusé",
  rembourse:  "Remboursé",
};

const methodeLabel: Record<string, string> = {
  carte:    "Carte bancaire",
  cash:     "Espèces",
  virement: "Virement",
  cheque:   "Chèque",
};

export default function PaiementsList() {
  const { payments, orders } = useData();
  const [search, setSearch] = useState("");

  const getNumeroCommande = (numeroCmd: string) => {
    const order = orders.find((o) => o._id === numeroCmd);
    if (order) return generateNumeroCommande(orders, order._id);
    return numeroCmd.substring(0, 8).toUpperCase();
  };

  const filtered = payments.filter((p) => {
    const numeroDisplay = getNumeroCommande(p.numeroCommande).toLowerCase();
    const methode = (methodeLabel[p.methode] ?? p.methode).toLowerCase();
    const statut = (statutLabel[p.statut] ?? p.statut).toLowerCase();
    const q = search.toLowerCase();
    return (
      numeroDisplay.includes(q) ||
      methode.includes(q) ||
      statut.includes(q) ||
      p.date.includes(q) ||
      p.montant.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground mt-2">Suivi des paiements clients.</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par N° commande, méthode, statut..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="input-search"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead className="text-right">Montant (DT)</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucun paiement trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p._id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-semibold text-indigo-600">
                    {getNumeroCommande(p.numeroCommande)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {p.montant.toLocaleString("fr-TN")}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {methodeLabel[p.methode] ?? p.methode}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statutBadge[p.statut] ?? "bg-gray-100 text-gray-700"}`}>
                      {statutLabel[p.statut] ?? p.statut}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">{p.date}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
