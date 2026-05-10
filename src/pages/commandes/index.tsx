import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import { generateNumeroCommande } from "@/lib/utils";

const statutBadge: Record<string, string> = {
  "Confirmée":    "bg-blue-50 text-blue-700",
  "Expédiée":     "bg-indigo-50 text-indigo-700",
  "Livrée":       "bg-green-50 text-green-700",
  "Annulée":      "bg-red-50 text-red-700",
};

export default function CommandesList() {
  const { orders, ordersLoading } = useData();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const confirmedOrders = orders.filter((o) => o.statut !== "En attente");

  const filtered = confirmedOrders.filter((o) =>
    generateNumeroCommande(confirmedOrders, o._id).toLowerCase().includes(search.toLowerCase()) ||
    o.client.toLowerCase().includes(search.toLowerCase()) ||
    o.statut.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
        <p className="text-muted-foreground mt-2">Commandes confirmées de vos clients.</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par N°, client ou statut..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="input-search"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {ordersLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Chargement des commandes…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Total (DT)</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucune commande confirmée.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => {
                  const numero = generateNumeroCommande(confirmedOrders, o._id);
                  return (
                    <TableRow key={o._id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <button
                          onClick={() => setLocation(`/commandes/${o._id}`)}
                          className="font-semibold text-indigo-600 hover:underline"
                          data-testid={`link-order-${o._id}`}
                        >
                          {numero}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{o.client}</TableCell>
                      <TableCell className="text-right font-medium">
                        {o.total.toLocaleString("fr-TN")}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statutBadge[o.statut] ?? "bg-gray-100 text-gray-700"}`}>
                          {o.statut}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">{o.dateCommande}</TableCell>
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
