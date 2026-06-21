import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { User } from "@/data/mockData";
import { generateNumeroUtilisateur } from "@/lib/utils";
import { api } from "@/lib/api";

export default function UtilisateurForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nouveau";
  const [, setLocation] = useLocation();
  const { users, refreshUsers } = useData();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "client"
  });

  useEffect(() => {
    if (!isNew) {
      const u = users.find(u => u._id === id);
      if (u) {
        setFormData(u);
      } else {
        toast({ title: "Erreur", description: "Utilisateur non trouvé", variant: "destructive" });
        setLocation("/utilisateurs");
      }
    }
  }, [id, isNew, users, setLocation, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/users", {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          motDePasse: formData.motDePasse,
          role: formData.role,
        });
        toast({ title: "Succès", description: "Utilisateur créé avec succès" });
      } else {
        await api.put(`/users/${id}`, {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          role: formData.role,
        });
        toast({ title: "Succès", description: "Utilisateur mis à jour avec succès" });
      }
      await refreshUsers();
      setLocation("/utilisateurs");
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder l'utilisateur", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/users/${id}`);
      toast({ title: "Succès", description: "Utilisateur supprimé avec succès" });
      await refreshUsers();
      setLocation("/utilisateurs");
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer l'utilisateur", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/utilisateurs")} data-testid="button-back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isNew
              ? "Nouvel utilisateur"
              : `${generateNumeroUtilisateur(users, id!)} — ${formData.prenom} ${formData.nom}`}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isNew ? "Créer un utilisateur" : "Modifier l'utilisateur"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input id="nom" name="nom" value={formData.nom ?? ""} onChange={handleChange} required data-testid="input-nom" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input id="prenom" name="prenom" value={formData.prenom ?? ""} onChange={handleChange} required data-testid="input-prenom" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" value={formData.email ?? ""} onChange={handleChange} required data-testid="input-email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motDePasse">Mot de passe *</Label>
            <Input id="motDePasse" name="motDePasse" type="password" value={formData.motDePasse ?? ""} onChange={handleChange} required data-testid="input-motDePasse" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(val) => handleSelectChange("role", val)}>
              <SelectTrigger id="role" data-testid="select-role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="internaute">Internaute</SelectItem>
                <SelectItem value="superAdmin">Super Admin</SelectItem>
                <SelectItem value="adminMarketing">Admin Marketing</SelectItem>
                <SelectItem value="adminAchat">Admin Achat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          {!isNew ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="gap-2" disabled={saving} data-testid="button-delete">
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. L'utilisateur sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Confirmer la suppression
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : <div />}

          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => setLocation("/utilisateurs")} disabled={saving} data-testid="button-cancel">
              Annuler
            </Button>
            <Button type="submit" className="gap-2" disabled={saving} data-testid="button-submit">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isNew ? "Créer l'utilisateur" : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
