import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
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
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { Supplier } from "@/data/mockData";
import { api } from "@/lib/api";

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function FournisseurForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nouveau";
  const [, setLocation] = useLocation();
  const { suppliers, refreshSuppliers } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<Partial<Supplier>>({
    nom: "",
    tel: "",
    email: "",
    siteWeb: "",
  });

  useEffect(() => {
    if (!isNew) {
      const s = suppliers.find((s) => s._id === id);
      if (s) {
        setFormData({ nom: s.nom, tel: s.tel, email: s.email, siteWeb: s.siteWeb });
      }
    }
  }, [id, isNew, suppliers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom?.trim()) {
      toast({ title: "Erreur", description: "Le nom est obligatoire", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const payload = {
          ...formData,
          creePar: user?._id ?? undefined,
        };
        await api.post("/fournisseurs", payload);
        toast({ title: "Succès", description: "Fournisseur créé avec succès" });
      } else {
        await api.put(`/fournisseurs/${id}`, formData);
        toast({ title: "Succès", description: "Fournisseur mis à jour avec succès" });
      }
      await refreshSuppliers();
      setLocation("/fournisseurs");
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/fournisseurs/${id}`);
      toast({ title: "Succès", description: "Fournisseur supprimé avec succès" });
      await refreshSuppliers();
      setLocation("/fournisseurs");
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setLocation("/fournisseurs")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          data-testid="button-back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {isNew ? "Nouveau fournisseur" : "Modifier le fournisseur"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">
            {isNew ? "Informations du fournisseur" : formData.nom}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  name="nom"
                  value={formData.nom ?? ""}
                  onChange={handleChange}
                  className={inp}
                  required
                  data-testid="input-nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  name="tel"
                  value={formData.tel ?? ""}
                  onChange={handleChange}
                  className={inp}
                  placeholder="(+216) 00 000 000"
                  data-testid="input-tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email ?? ""}
                  onChange={handleChange}
                  className={inp}
                  data-testid="input-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input
                  name="siteWeb"
                  value={formData.siteWeb ?? ""}
                  onChange={handleChange}
                  className={inp}
                  placeholder="https://..."
                  data-testid="input-siteWeb"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pb-6">
          {!isNew ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={deleting}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  data-testid="button-delete"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={15} />}
                  Supprimer
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le fournisseur sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirmer la suppression
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : <div />}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLocation("/fournisseurs")}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-cancel"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
              data-testid="button-submit"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isNew ? "Créer le fournisseur" : "Sauvegarder"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
