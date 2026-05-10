import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import { generateNumeroDevisFromOrder } from "@/lib/utils";

export default function DevisList() {
  const { orders, ordersLoading } = useData();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const pendingOrders = orders.filter((o) => o.statut === "En attente");

  const filtered = pendingOrders.filter((o) => {
    const num = generateNumeroDevisFromOrder(pendingOrders, o._id).toLowerCase();
    return (
      num.includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
        <p className="text-muted-foreground mt-2">Commandes en attente de confirmation.</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par numéro ou client..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="input-search"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {ordersLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Chargement des devis…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Devis</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Total (DT)</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Aucun devis en attente.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => {
                  const numero = generateNumeroDevisFromOrder(pendingOrders, o._id);
                  return (
                    <TableRow key={o._id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <button
                          onClick={() => setLocation(`/devis/${o._id}`)}
                          className="font-semibold text-indigo-600 hover:underline"
                          data-testid={`link-devis-${o._id}`}
                        >
                          {numero}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{o.client}</TableCell>
                      <TableCell className="text-right font-medium">
                        {o.total.toLocaleString("fr-TN")}
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
