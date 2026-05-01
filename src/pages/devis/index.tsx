import { useState } from "react";
import { useLocation } from "wouter";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateNumeroDevis } from "@/lib/utils";

export default function DevisList() {
  const { quotes, quotesLoading } = useData();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const filtered = quotes.filter(
    (q) =>
      generateNumeroDevis(quotes, q._id).toLowerCase().includes(search.toLowerCase()) ||
      q.client.toLowerCase().includes(search.toLowerCase()) ||
      q.adminMarketing.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
          <p className="text-muted-foreground mt-2">Gérez les devis clients.</p>
        </div>
        <button
          onClick={() => toast({ title: "Info", description: "Création de devis en cours de développement" })}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          data-testid="button-create-quote"
        >
          <Plus size={16} />
          Créer un devis
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un devis..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="input-search"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {quotesLoading ? (
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
                <TableHead>Admin Marketing</TableHead>
                <TableHead className="text-center">Produits</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun devis trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((q) => {
                  const numero = generateNumeroDevis(quotes, q._id);
                  const nbProduits = q.produits?.length ?? "—";
                  return (
                    <TableRow key={q._id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <button
                          onClick={() => setLocation(`/devis/${q._id}`)}
                          className="font-semibold text-indigo-600 hover:underline"
                          data-testid={`link-quote-${q._id}`}
                        >
                          {numero}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{q.client}</TableCell>
                      <TableCell>{q.adminMarketing}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                          {nbProduits}
                        </span>
                      </TableCell>
                      <TableCell>{q.date}</TableCell>
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
