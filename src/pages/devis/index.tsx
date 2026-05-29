import { useState, useEffect, useCallback } from "react";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import { generateNumeroDevisFromOrder } from "@/lib/utils";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CommandeProduitLigne {
  _id: string;
  id_commande: { _id: string } | string;
}

export default function DevisList() {
  const { orders, ordersLoading, refreshOrders } = useData();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [validIds, setValidIds] = useState<Set<string> | null>(null);
  const [cleaning, setCleaning] = useState(false);

  const cleanEmptyDevis = useCallback(async () => {
    if (ordersLoading) return;
    setCleaning(true);
    try {
      const allLignes = await api.get<CommandeProduitLigne[]>("/commande-produits");

      const pendingOrders = orders.filter((o) => o.statut === "En attente");

      const idsWithProducts = new Set(
        allLignes.map((l) => {
          const cid = l.id_commande;
          return typeof cid === "object" ? cid._id : cid;
        })
      );

      const toDelete = pendingOrders.filter((o) => !idsWithProducts.has(o._id));

      if (toDelete.length > 0) {
        await Promise.all(toDelete.map((o) => api.delete(`/commandes/${o._id}`)));
        await refreshOrders();
        toast({
          title: `${toDelete.length} devis supprimé${toDelete.length > 1 ? "s" : ""}`,
          description: "Les devis sans produit ont été supprimés automatiquement.",
        });
      }

      setValidIds(idsWithProducts);
    } catch {
      setValidIds(new Set());
    } finally {
      setCleaning(false);
    }
  }, [orders, ordersLoading, refreshOrders, toast]);

  useEffect(() => {
    cleanEmptyDevis();
  }, [ordersLoading]);

  const pendingOrders = orders.filter((o) => o.statut === "En attente");
  const displayOrders =
    validIds === null
      ? []
      : pendingOrders.filter((o) => validIds.has(o._id));

  const filtered = displayOrders.filter((o) => {
    const num = generateNumeroDevisFromOrder(pendingOrders, o._id).toLowerCase();
    return (
      num.includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isLoading = ordersLoading || cleaning || validIds === null;

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
        {isLoading ? (
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
