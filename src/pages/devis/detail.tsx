import { useParams, useLocation } from "wouter";
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
import { generateNumeroDevis } from "@/lib/utils";
import { api } from "@/lib/api";

interface DevisInfo {
  _id: string;
  client: string;
  adminMarketing: string;
  date: string;
}

interface DevisProduitLigne {
  _id: string;
  id_produit: {
    _id: string;
    nom: string;
    reference?: string;
    prix?: number;
    cout?: number;
    categorie?: any;
  };
  dateCreation?: string;
}

function normalizeDevisInfo(raw: any): DevisInfo {
  const clientId = raw.clientId;
  const adminId = raw.adminMarketingId;
  const nomClient =
    clientId && typeof clientId === "object"
      ? `${clientId.nom ?? ""} ${clientId.prenom ?? ""}`.trim() || clientId.email || "—"
      : "—";
  const nomAdmin =
    adminId && typeof adminId === "object"
      ? `${adminId.nom ?? ""} ${adminId.prenom ?? ""}`.trim() || adminId.email || "—"
      : "—";
  return {
    _id: raw._id,
    client: nomClient,
    adminMarketing: nomAdmin,
    date: raw.dateDevis ? raw.dateDevis.substring(0, 10) : "—",
  };
}

export default function DevisDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { quotes, products, categories } = useData();
  const { toast } = useToast();

  const [devis, setDevis] = useState<DevisInfo | null>(null);
  const [lignes, setLignes] = useState<DevisProduitLigne[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  const fetchDevis = useCallback(async () => {
    setLoading(true);
    try {
      const [rawDevis, rawLignes] = await Promise.all([
        api.get<any>(`/devis/${id}`),
        api.get<any[]>(`/devis/${id}/devis-produits`),
      ]);
      setDevis(normalizeDevisInfo(rawDevis));
      setLignes(rawLignes ?? []);
    } catch {
      const found = quotes.find((q) => q._id === id);
      if (found) setDevis(found);
      setLignes([]);
    } finally {
      setLoading(false);
    }
  }, [id, quotes]);

  useEffect(() => {
    fetchDevis();
  }, [fetchDevis]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        Chargement…
      </div>
    );
  }

  if (!devis) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setLocation("/devis")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Retour aux devis
        </button>
        <p className="text-red-500">Devis non trouvé.</p>
      </div>
    );
  }

  const numero = generateNumeroDevis(quotes, devis._id);

  const getCategoryName = (cat: any): string => {
    if (!cat) return "—";
    if (typeof cat === "object") return cat.nom ?? "—";
    return categories.find((c) => c._id === cat)?.nom ?? "—";
  };

  const totalHT = lignes.reduce((sum, l) => sum + (l.id_produit?.prix ?? 0), 0);

  const alreadyAdded = new Set(lignes.map((l) => l.id_produit?._id).filter(Boolean));
  const availableToAdd = products.filter((p) => !alreadyAdded.has(p._id));

  const handleAddProduct = async () => {
    if (!selectedProductId) return;
    setSaving(true);
    try {
      await api.post(`/devis-produits`, { id_devis: id, id_produit: selectedProductId });
      await fetchDevis();
      setSelectedProductId("");
      toast({ title: "Succès", description: "Produit ajouté au devis" });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'ajouter le produit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLine = async (devisProduitsId: string) => {
    setSaving(true);
    try {
      await api.delete(`/devis-produits/${devisProduitsId}`);
      await fetchDevis();
      toast({ title: "Succès", description: "Produit retiré du devis" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de retirer le produit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLocation("/devis")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          data-testid="button-back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{numero}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Consulter et gérer les produits du devis</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Informations du devis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">N° Devis</p>
            <p className="font-semibold text-indigo-600">{numero}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Client</p>
            <p className="font-medium text-gray-900">{devis.client}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Admin Marketing</p>
            <p className="font-medium text-gray-900">{devis.adminMarketing}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-900">{devis.date}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Produits ({lignes.length})
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Prix (DT)</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lignes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucun produit dans ce devis.
                </TableCell>
              </TableRow>
            ) : (
              lignes.map((ligne) => {
                const prod = ligne.id_produit;
                return (
                  <TableRow key={ligne._id} data-testid={`row-qp-${ligne._id}`}>
                    <TableCell className="font-mono text-xs text-gray-500">
                      {prod?.reference ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {prod?.nom ?? <span className="text-red-400 italic">Produit introuvable</span>}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {getCategoryName(prod?.categorie)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {prod?.prix != null ? prod.prix.toLocaleString("fr-TN") : "—"}
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
                              Le produit sera retiré du devis {numero}.
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
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="select-add-product"
            >
              <option value="">-- Sélectionner un produit --</option>
              {availableToAdd.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.reference ?? p._id.slice(-6)} — {p.nom}
                </option>
              ))}
            </select>
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
              <p className="text-sm text-gray-500">Total HT</p>
              <p className="text-xl font-bold text-gray-900">
                {totalHT.toLocaleString("fr-TN")} DT
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
