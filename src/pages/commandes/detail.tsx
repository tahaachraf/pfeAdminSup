import { useLocation, useParams } from "wouter";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect, useCallback } from "react";
import { generateNumeroCommande } from "@/lib/utils";
import { api } from "@/lib/api";
import { Order, OrderProduct } from "@/data/mockData";

const statutBadge: Record<string, string> = {
  "En attente":    "bg-yellow-50 text-yellow-700",
  "Confirmée":     "bg-blue-50 text-blue-700",
  "En livraison":  "bg-indigo-50 text-indigo-700",
  "Livrée":        "bg-green-50 text-green-700",
  "Annulée":       "bg-red-50 text-red-700",
};

const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function CommandeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { orders, products } = useData();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Order>(`/commandes/${id}`);
      setOrder(data);
    } catch {
      const found = orders.find((o) => o._id === id) ?? null;
      setOrder(found);
    } finally {
      setLoading(false);
    }
  }, [id, orders]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        Chargement…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <button onClick={() => setLocation("/commandes")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour aux commandes
        </button>
        <p className="text-red-500">Commande non trouvée.</p>
      </div>
    );
  }

  const numero = generateNumeroCommande(orders, order._id);
  const lignes: OrderProduct[] = order.produits ?? [];
  const getProduct = (pid: string) => products.find((p) => p._id === pid);
  const totalCalcule = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);

  const handleChangeStatut = async (statut: string) => {
    setSaving(true);
    try {
      await api.patch(`/commandes/${id}`, { statut });
      setOrder((prev) => prev ? { ...prev, statut } : prev);
      toast({ title: "Succès", description: `Statut mis à jour : ${statut}` });
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le statut", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId) return;
    if (lignes.some((l) => l.id_produit === selectedProductId)) {
      toast({ title: "Déjà ajouté", description: "Ce produit est déjà dans la commande", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await api.post(`/commandes/${id}/produits`, {
        id_produit: selectedProductId,
        quantite: selectedQty,
      });
      await fetchOrder();
      setSelectedProductId("");
      setSelectedQty(1);
      toast({ title: "Succès", description: "Produit ajouté à la commande" });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'ajouter le produit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLine = async (orderProductId: string) => {
    setSaving(true);
    try {
      await api.delete(`/commandes/${id}/produits/${orderProductId}`);
      await fetchOrder();
      toast({ title: "Succès", description: "Produit retiré de la commande" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de retirer le produit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const availableToAdd = products.filter(
    (p) => !lignes.some((l) => l.id_produit === p._id)
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLocation("/commandes")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          data-testid="button-back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{numero}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Détail de la commande</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Informations de la commande</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">N° Commande</p>
            <p className="font-semibold text-indigo-600">{numero}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Client</p>
            <p className="font-medium text-gray-900">{order.client}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-900">{order.dateCommande}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Statut</p>
            <select
              value={order.statut}
              onChange={(e) => handleChangeStatut(e.target.value)}
              disabled={saving}
              className={`${inp} w-full disabled:opacity-60`}
              data-testid="select-statut"
            >
              {["En attente", "Confirmée", "En livraison", "Livrée", "Annulée"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Produits ({lignes.length})
          </h2>
          {saving && <Loader2 size={16} className="animate-spin text-gray-400" />}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="text-center">Qté</TableHead>
              <TableHead className="text-right">Prix unitaire (DT)</TableHead>
              <TableHead className="text-right">Sous-total (DT)</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lignes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun produit dans cette commande.
                </TableCell>
              </TableRow>
            ) : (
              lignes.map((ligne) => {
                const prod = getProduct(ligne.id_produit);
                return (
                  <TableRow key={ligne._id} data-testid={`row-op-${ligne._id}`}>
                    <TableCell className="font-mono text-xs text-gray-500">
                      {prod?.reference ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {prod?.nom ?? <span className="text-red-400 italic">Produit introuvable</span>}
                    </TableCell>
                    <TableCell className="text-center font-medium">{ligne.quantite}</TableCell>
                    <TableCell className="text-right">{ligne.prixUnitaire.toLocaleString("fr-TN")}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {(ligne.quantite * ligne.prixUnitaire).toLocaleString("fr-TN")}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            disabled={saving}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                            data-testid={`btn-remove-${ligne._id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Retirer ce produit ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Le produit sera retiré de la commande {numero}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveLine(ligne._id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Retirer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Ajouter un produit</p>
          <div className="flex gap-2">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className={`flex-1 ${inp}`}
              data-testid="select-add-product"
            >
              <option value="">-- Sélectionner un produit --</option>
              {availableToAdd.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.reference} — {p.nom} ({p.prix.toLocaleString("fr-TN")} DT)
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={selectedQty}
              onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
              className={`w-20 text-center ${inp}`}
              data-testid="input-qty"
            />
            <button
              onClick={handleAddProduct}
              disabled={!selectedProductId || saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg transition-colors"
              data-testid="btn-add-product"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Ajouter
            </button>
          </div>
        </div>

        {lignes.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total TTC</p>
              <p className="text-xl font-bold text-gray-900">
                {totalCalcule.toLocaleString("fr-TN")} DT
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
