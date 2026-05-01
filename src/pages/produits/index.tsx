import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Loader2 } from "lucide-react";

export default function ProduitsList() {
  const { products, productsLoading, categories } = useData();
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground mt-2">Gérez le catalogue de produits de votre plateforme.</p>
        </div>
        <Link href="/produits/nouveau">
          <Button className="gap-2" data-testid="button-create-product">
            <Plus className="h-4 w-4" />
            Créer un produit
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par référence ou nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden min-h-[120px]">
        {productsLoading ? (
          <div className="flex items-center justify-center py-14 text-gray-400">
            <Loader2 size={22} className="animate-spin mr-2" />
            Chargement des produits…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Coût (DT)</TableHead>
                <TableHead className="text-right">Prix de vente (DT)</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p._id} data-testid={`row-product-${p._id}`}>
                    <TableCell className="font-medium">
                      <Link href={`/produits/${p._id}`} className="text-primary hover:underline">
                        {p.reference}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/produits/${p._id}`} className="hover:underline">
                        {p.nom}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {categories.find((c) => c._id === p.categorie)?.nom ?? p.categorie ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">{(p.cout ?? 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{(p.prix ?? 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{p.quantiteStock ?? 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
