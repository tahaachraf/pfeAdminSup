import { useLocation, useParams } from "wouter";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { generateNumeroCommande } from "@/lib/utils";
import { api } from "@/lib/api";

interface CommandeRaw {
  _id: string;
  clientId: { _id: string; nom: string; prenom: string; email: string } | string;
  statut: string;
  total: number;
  dateCommande: string;
}

interface CommandeProduitLigne {
  _id: string;
  id_commande: { _id: string } | string;
  id_produit: {
    _id: string;
    nom: string;
    reference?: string;
    prix?: number;
  };
  quantite: number;
  prixUnitaire: number;
}

const statutBadge: Record<string, string> = {
  "Confirmée":    "bg-blue-50 text-blue-700",
  "Expédiée":     "bg-indigo-50 text-indigo-700",
  "Livrée":       "bg-green-50 text-green-700",
  "Annulée":      "bg-red-50 text-red-700",
};

const inp = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

function clientName(raw: CommandeRaw): string {
  const c = raw.clientId;
  if (c && typeof c === "object") {
    return `${c.nom ?? ""} ${c.prenom ?? ""}`.trim() || c.email || "—";
  }
  return "—";
}

export default function CommandeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { orders, refreshOrders } = useData();
  const { toast } = useToast();

  const [commande, setCommande] = useState<CommandeRaw | null>(null);
  const [lignes, setLignes] = useState<CommandeProduitLigne[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const confirmedOrders = orders.filter((o) => o.statut !== "En attente");
  const numero = commande ? generateNumeroCommande(confirmedOrders, commande._id) : "…";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rawCommande, allLignes] = await Promise.all([
        api.get<CommandeRaw>(`/commandes/${id}`),
        api.get<CommandeProduitLigne[]>("/commande-produits"),
      ]);
      setCommande(rawCommande);
      setLignes(
        allLignes.filter((l) => {
          const cid = l.id_commande;
          return typeof cid === "object" ? cid._id === id : cid === id;
        })
      );
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger la commande", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangeStatut = async (statut: string) => {
    setSaving(true);
    try {
      await api.patch(`/commandes/${id}`, { statut });
      setCommande((prev) => (prev ? { ...prev, statut } : prev));
      await refreshOrders();
      toast({ title: "Succès", description: `Statut mis à jour : ${statut}` });
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le statut", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        Chargement…
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="space-y-4">
        <button onClick={() => setLocation("/commandes")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour aux commandes
        </button>
        <p className="text-red-500">Commande non trouvée.</p>
      </div>
    );
  }

  const totalCalcule = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);

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
            <p className="font-medium text-gray-900">{clientName(commande)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-900">{commande.dateCommande?.substring(0, 10) ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Statut</p>
            <select
              value={commande.statut}
              onChange={(e) => handleChangeStatut(e.target.value)}
              disabled={saving}
              className={`${inp} w-full disabled:opacity-60`}
              data-testid="select-statut"
            >
              {["Confirmée", "Expédiée", "Livrée", "Annulée"].map((s) => (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {lignes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucun produit dans cette commande.
                </TableCell>
              </TableRow>
            ) : (
              lignes.map((ligne) => {
                const prod = ligne.id_produit;
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
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {lignes.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-6 text-sm">
            <div className="text-right">
              <p className="text-gray-500">Total DB</p>
              <p className="text-lg font-bold text-gray-900">
                {commande.total.toLocaleString("fr-TN")} DT
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Total calculé</p>
              <p className="text-lg font-bold text-indigo-700">
                {totalCalcule.toLocaleString("fr-TN")} DT
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">Statut actuel :</p>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statutBadge[commande.statut] ?? "bg-gray-100 text-gray-700"}`}>
            {commande.statut}
          </span>
        </div>
      </div>
    </div>
  );
}
