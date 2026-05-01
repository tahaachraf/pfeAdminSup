import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/lib/utils";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ArrowLeft, Check, ChevronsUpDown,
  ImagePlus, Loader2, Paperclip, Plus, Trash2, Upload,
} from "lucide-react";
import { Category, Product, Supplier } from "@/data/mockData";
import { api } from "@/lib/api";

// ─── Category path helper ──────────────────────────────────────────────────────

function getFullPath(catId: string, cats: Category[]): string {
  const cat = cats.find((c) => c._id === catId);
  if (!cat) return catId;
  if (!cat.categorieParent) return cat.nom;
  return getFullPath(cat.categorieParent, cats) + " > " + cat.nom;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageItem {
  file: File;
  preview: string;
  texteAlternatif: string;
  ordreAffichage: number;
}

interface PieceJointeItem {
  file: File;
  nomFichier: string;
  type: string;
  taille: string;
}

interface ApproEntry {
  fournisseurId: string;
  referenceFournisseur: string;
  prixAchat: number | "";
}

// ─── Input class ──────────────────────────────────────────────────────────────

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

// ─── Drag-drop zone ───────────────────────────────────────────────────────────

function DropZone({
  accept, multiple, label, onFiles,
}: {
  accept: string;
  multiple?: boolean;
  label: string;
  onFiles: (files: File[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = (files: FileList | null) => {
    if (!files) return;
    onFiles(Array.from(files));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      onClick={() => ref.current?.click()}
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors select-none
        ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"}`}
    >
      <Upload size={22} className="text-gray-400" />
      <p className="text-sm text-gray-500 text-center">{label}</p>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}

// ─── ApproRow ─────────────────────────────────────────────────────────────────

function ApproRow({
  entry,
  suppliers,
  onChange,
  onRemove,
}: {
  entry: ApproEntry;
  suppliers: Supplier[];
  onChange: (patch: Partial<ApproEntry>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = suppliers.find((s) => s._id === entry.fournisseurId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end p-4 border border-gray-200 rounded-lg bg-gray-50">
      {/* Fournisseur */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Fournisseur</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`${inp} flex items-center justify-between text-left`}
            >
              <span className="truncate text-sm">
                {selected ? selected.nom : <span className="text-gray-400">Sélectionner...</span>}
              </span>
              <ChevronsUpDown size={13} className="ml-2 shrink-0 text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Rechercher un fournisseur..." />
              <CommandList className="max-h-52">
                <CommandEmpty>Aucun fournisseur trouvé.</CommandEmpty>
                <CommandGroup>
                  {suppliers.map((s) => (
                    <CommandItem
                      key={s._id}
                      value={s.nom}
                      onSelect={() => { onChange({ fournisseurId: s._id }); setOpen(false); }}
                    >
                      <Check
                        size={13}
                        className={`mr-2 shrink-0 ${entry.fournisseurId === s._id ? "opacity-100" : "opacity-0"}`}
                      />
                      <div>
                        <p className="text-sm">{s.nom}</p>
                        {s.tel && <p className="text-xs text-gray-400">{s.tel}</p>}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Référence fournisseur */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Référence fournisseur</label>
        <input
          value={entry.referenceFournisseur}
          onChange={(e) => onChange({ referenceFournisseur: e.target.value })}
          placeholder="Ex : OPC05689"
          className={inp}
        />
      </div>

      {/* Prix d'achat */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Prix d'achat (DT)</label>
        <input
          type="number"
          step="0.001"
          value={entry.prixAchat}
          onChange={(e) => onChange({ prixAchat: e.target.value === "" ? "" : Number(e.target.value) })}
          placeholder="0.000"
          className={inp}
        />
      </div>

      {/* Supprimer */}
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
        title="Supprimer"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// ─── MultiSelect (tags + recherche) ───────────────────────────────────────────

interface MSOption { id: string; label: string; sublabel?: string; }

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Rechercher...",
  addLabel = "Ajouter",
}: {
  options: MSOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  const available = options.filter((o) => !selected.includes(o.id));
  const selectedOptions = options.filter((o) => selected.includes(o.id));

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
      setOpen(false);
    }
  };

  const remove = (id: string) => onChange(selected.filter((s) => s !== id));

  return (
    <div className="space-y-2">
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((o) => (
            <span
              key={o.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium"
            >
              <span>{o.label}</span>
              {o.sublabel && <span className="text-indigo-400">· {o.sublabel}</span>}
              <button
                type="button"
                onClick={() => remove(o.id)}
                className="ml-0.5 text-indigo-400 hover:text-indigo-700 leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`${inp} flex items-center justify-between text-left text-gray-400`}
          >
            <span className="text-sm">{addLabel}</span>
            <ChevronsUpDown size={14} className="ml-2 shrink-0 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList className="max-h-56">
              {available.length === 0 ? (
                <CommandEmpty>Aucun résultat.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {available.map((o) => (
                    <CommandItem
                      key={o.id}
                      value={`${o.label} ${o.sublabel ?? ""}`}
                      onSelect={() => toggle(o.id)}
                    >
                      <div className="flex flex-col">
                        <span>{o.label}</span>
                        {o.sublabel && (
                          <span className="text-xs text-gray-400">{o.sublabel}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProduitForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "nouveau";
  const [, setLocation] = useLocation();
  const { products, refreshProducts, categories, brands, modeles, suppliers } = useData();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // ── Catégorie combobox ──
  const [catOpen, setCatOpen] = useState(false);
  const catOptions = useMemo(
    () =>
      categories.map((c) => ({
        _id: c._id,
        path: getFullPath(c._id, categories),
      })).sort((a, b) => a.path.localeCompare(b.path)),
    [categories]
  );

  // ── MultiSelect options ──
  const marqueOptions = useMemo<MSOption[]>(
    () => brands.map((m) => ({ id: m._id, label: m.nom })),
    [brands]
  );
  const modeleOptions = useMemo<MSOption[]>(
    () =>
      modeles.map((m) => {
        const marque = brands.find((ma) => ma._id === m.idMarque);
        return { id: m._id, label: m.nom, sublabel: marque?.nom };
      }),
    [modeles, brands]
  );
  const prodComplOptions = useMemo<MSOption[]>(
    () =>
      products
        .filter((p) => p._id !== id)
        .map((p) => ({ id: p._id, label: p.nom, sublabel: p.reference })),
    [products, id]
  );

  // ── Extra state ──
  const [images, setImages] = useState<ImageItem[]>([]);
  const [piecesJointes, setPJ] = useState<PieceJointeItem[]>([]);
  const [prodCompl, setProdCompl] = useState<string[]>([]);
  const [selMarques, setSelMarques] = useState<string[]>([]);
  const [selModeles, setSelModeles] = useState<string[]>([]);
  const [approvisionnements, setAppros] = useState<ApproEntry[]>([]);

  const addAppro = () =>
    setAppros((p) => [...p, { fournisseurId: "", referenceFournisseur: "", prixAchat: "" }]);
  const updateAppro = (i: number, patch: Partial<ApproEntry>) =>
    setAppros((p) => p.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const removeAppro = (i: number) =>
    setAppros((p) => p.filter((_, idx) => idx !== i));

  // ── Form data ──
  const [formData, setFormData] = useState<Partial<Product>>({
    reference: "",
    nom: "",
    titreSite: "",
    slug: "",
    description: "",
    descriptionSupplementaire: "",
    metaDescription: "",
    motsClesMeta: "",
    cout: 0,
    prix: 0,
    poids: 0,
    quantiteStock: 0,
    delaiLivraison: 0,
    categorie: "",
    promotion: false,
    afficherLaQuantiteDispo: true,
    statutProduit: "actif",
  });

  useEffect(() => {
    if (!isNew) {
      const p = products.find((p) => p._id === id);
      if (p) {
        setFormData(p);
      } else {
        toast({ title: "Erreur", description: "Produit non trouvé", variant: "destructive" });
        setLocation("/produits");
      }
    }
  }, [id, isNew, products, setLocation, toast]);

  // Auto-generate slug from nom (only on create)
  useEffect(() => {
    if (isNew && formData.nom) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.nom ?? "") }));
    }
  }, [formData.nom, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  // ── Images handlers ──
  const addImages = (files: File[]) => {
    const items: ImageItem[] = files.map((f, i) => ({
      file: f,
      preview: URL.createObjectURL(f),
      texteAlternatif: "",
      ordreAffichage: images.length + i + 1,
    }));
    setImages((p) => [...p, ...items]);
  };
  const updateImage = (i: number, patch: Partial<ImageItem>) =>
    setImages((p) => p.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));
  const removeImage = (i: number) => setImages((p) => p.filter((_, idx) => idx !== i));

  // ── PJ handlers ──
  const addPJ = (files: File[]) => {
    const items: PieceJointeItem[] = files.map((f) => ({
      file: f,
      nomFichier: f.name,
      type: f.name.split(".").pop()?.toLowerCase() ?? "",
      taille: "simple",
    }));
    setPJ((p) => [...p, ...items]);
  };
  const updatePJ = (i: number, patch: Partial<PieceJointeItem>) =>
    setPJ((p) => p.map((pj, idx) => (idx === i ? { ...pj, ...patch } : pj)));
  const removePJ = (i: number) => setPJ((p) => p.filter((_, idx) => idx !== i));

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/produits", formData);
        toast({ title: "Succès", description: "Produit créé avec succès" });
      } else {
        await api.put(`/produits/${id}`, formData);
        toast({ title: "Succès", description: "Produit mis à jour avec succès" });
      }
      await refreshProducts();
      setLocation("/produits");
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder le produit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/produits/${id}`);
      toast({ title: "Succès", description: "Produit supprimé avec succès" });
      await refreshProducts();
      setLocation("/produits");
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer le produit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const fs = "border border-gray-200 rounded-xl bg-white shadow-sm";
  const leg = "ml-5 px-2 text-sm font-semibold text-indigo-700 bg-white";
  const fp = "p-6 space-y-4";

  return (
    <div className="max-w-3xl">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setLocation("/produits")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          data-testid="button-back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {isNew ? "Créer un produit" : `Modifier — ${formData.nom}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ══ 1. Informations générales ══ */}
        <fieldset className={fs}>
          <legend className={leg}>Informations générales</legend>
          <div className={fp}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input name="nom" value={formData.nom ?? ""} onChange={handleChange}
                  className={inp} required data-testid="input-nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Référence *</label>
                <input name="reference" value={formData.reference ?? ""} onChange={handleChange}
                  className={inp} required data-testid="input-reference" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <Popover open={catOpen} onOpenChange={setCatOpen}>
                  <PopoverTrigger asChild>
                    <button type="button"
                      className={`${inp} flex items-center justify-between text-left`}
                      data-testid="select-categorie">
                      <span className="truncate text-sm">
                        {formData.categorie
                          ? catOptions.find((o) => o._id === formData.categorie)?.path ?? String(formData.categorie)
                          : <span className="text-gray-400">-- Sélectionner --</span>}
                      </span>
                      <ChevronsUpDown size={14} className="ml-2 shrink-0 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher une catégorie..." />
                      <CommandList className="max-h-60">
                        <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem value="aucune" onSelect={() => { setFormData((p) => ({ ...p, categorie: "" })); setCatOpen(false); }}>
                            <Check size={14} className={`mr-2 shrink-0 ${!formData.categorie ? "opacity-100" : "opacity-0"}`} />
                            -- Aucune --
                          </CommandItem>
                          {catOptions.map((o) => (
                            <CommandItem key={o._id} value={o.path}
                              onSelect={() => { setFormData((p) => ({ ...p, categorie: o._id })); setCatOpen(false); }}>
                              <Check size={14} className={`mr-2 shrink-0 ${formData.categorie === o._id ? "opacity-100" : "opacity-0"}`} />
                              {o.path}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select name="statutProduit" value={formData.statutProduit ?? "actif"}
                  onChange={handleChange} className={inp} data-testid="select-statut">
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="archivé">Archivé</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DT) *</label>
                <input name="cout" type="number" step="0.001" value={formData.cout ?? ""}
                  onChange={handleChange} className={inp} required data-testid="input-cout" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (DT) *</label>
                <input name="prix" type="number" step="0.001" value={formData.prix ?? ""}
                  onChange={handleChange} className={inp} required data-testid="input-prix" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en stock *</label>
                <input name="quantiteStock" type="number" value={formData.quantiteStock ?? ""}
                  onChange={handleChange} className={inp} required data-testid="input-quantiteStock" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                <input name="poids" type="number" step="0.001" value={formData.poids ?? ""}
                  onChange={handleChange} className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Délai de livraison (jours)</label>
                <input name="delaiLivraison" type="number" value={formData.delaiLivraison ?? ""}
                  onChange={handleChange} className={inp} />
              </div>
            </div>

            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="promotion" checked={formData.promotion ?? false}
                  onChange={handleChange} className="rounded border-gray-300 text-indigo-600"
                  data-testid="checkbox-promotion" />
                <span className="text-sm text-gray-700">En promotion</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="afficherLaQuantiteDispo"
                  checked={formData.afficherLaQuantiteDispo ?? true}
                  onChange={handleChange} className="rounded border-gray-300 text-indigo-600"
                  data-testid="checkbox-afficherQuantite" />
                <span className="text-sm text-gray-700">Afficher la quantité disponible</span>
              </label>
            </div>

          </div>
        </fieldset>

        {/* ══ 2. Marques & Modèles ══ */}
        <fieldset className={fs}>
          <legend className={leg}>Marques &amp; Modèles</legend>
          <div className={fp}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marques
              </label>
              <MultiSelect
                options={marqueOptions}
                selected={selMarques}
                onChange={setSelMarques}
                placeholder="Rechercher une marque..."
                addLabel="Ajouter une marque"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modèles
              </label>
              <MultiSelect
                options={modeleOptions}
                selected={selModeles}
                onChange={setSelModeles}
                placeholder="Rechercher un modèle..."
                addLabel="Ajouter un modèle"
              />
            </div>
          </div>
        </fieldset>

        {/* ══ 3. Contenu ══ */}
        <fieldset className={fs}>
          <legend className={leg}>Contenu</legend>
          <div className={fp}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description ?? ""}
                onChange={handleChange} rows={4} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description supplémentaire</label>
              <textarea name="descriptionSupplementaire" value={formData.descriptionSupplementaire ?? ""}
                onChange={handleChange} rows={4} className={inp} />
            </div>
          </div>
        </fieldset>

        {/* ══ 4. SEO ══ */}
        <fieldset className={fs}>
          <legend className={leg}>SEO</legend>
          <div className={fp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre site</label>
                <input name="titreSite" value={formData.titreSite ?? ""}
                  onChange={handleChange} className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                  <span className="ml-1 text-xs text-gray-400 font-normal">auto-généré</span>
                </label>
                <input name="slug" value={formData.slug ?? ""} onChange={handleChange}
                  className={`${inp} bg-gray-50`} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
                <input name="metaDescription" value={formData.metaDescription ?? ""}
                  onChange={handleChange} className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mots-clés meta</label>
                <input name="motsClesMeta" value={formData.motsClesMeta ?? ""}
                  onChange={handleChange} className={inp} />
              </div>
            </div>
          </div>
        </fieldset>

        {/* ══ 5. Médias ══ */}
        <fieldset className={fs}>
          <legend className={leg}>Médias</legend>
          <div className={fp}>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <ImagePlus size={15} className="text-indigo-500" />
                Images du produit
                {images.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{images.length}</span>
                )}
              </p>
              <DropZone accept="image/*" multiple
                label="Glissez vos images ici ou cliquez pour sélectionner"
                onFiles={addImages} />
              {images.length > 0 && (
                <div className="mt-3 space-y-3">
                  {images.map((img, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 border border-gray-200 rounded-lg">
                      <img src={img.preview} alt={img.texteAlternatif || "preview"}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-gray-200" />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Texte alternatif</label>
                          <input value={img.texteAlternatif}
                            onChange={(e) => updateImage(i, { texteAlternatif: e.target.value })}
                            placeholder="Description de l'image" className={inp} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Ordre d'affichage</label>
                          <input type="number" value={img.ordreAffichage}
                            onChange={(e) => updateImage(i, { ordreAffichage: Number(e.target.value) })}
                            className={inp} />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeImage(i)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Paperclip size={15} className="text-indigo-500" />
                Pièces jointes
                {piecesJointes.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{piecesJointes.length}</span>
                )}
              </p>
              <DropZone accept="*" multiple
                label="Glissez vos fichiers ici ou cliquez pour sélectionner"
                onFiles={addPJ} />
              {piecesJointes.length > 0 && (
                <div className="mt-3 space-y-3">
                  {piecesJointes.map((pj, i) => (
                    <div key={i} className="flex gap-3 items-end p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="md:col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Nom du fichier</label>
                          <input value={pj.nomFichier}
                            onChange={(e) => updatePJ(i, { nomFichier: e.target.value })} className={inp} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <input value={pj.type}
                            onChange={(e) => updatePJ(i, { type: e.target.value })} className={inp} />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Taille</label>
                          <input value={pj.taille}
                            onChange={(e) => updatePJ(i, { taille: e.target.value })}
                            placeholder="simple / double" className={inp} />
                        </div>
                      </div>
                      <button type="button" onClick={() => removePJ(i)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mb-0.5">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </fieldset>

        {/* ══ 6. Approvisionnement ══ */}
        <fieldset className={fs}>
          <legend className={leg}>Approvisionnement</legend>
          <div className={fp}>
            {approvisionnements.length === 0 && (
              <p className="text-sm text-gray-400 italic">Aucun fournisseur lié à ce produit.</p>
            )}
            <div className="space-y-3">
              {approvisionnements.map((entry, i) => (
                <ApproRow
                  key={i}
                  entry={entry}
                  suppliers={suppliers}
                  onChange={(patch) => updateAppro(i, patch)}
                  onRemove={() => removeAppro(i)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addAppro}
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <Plus size={15} />
              Ajouter un fournisseur
            </button>
          </div>
        </fieldset>

        {/* ══ 7. Produits complémentaires ══ */}
        <fieldset className={fs}>
          <legend className={leg}>Produits complémentaires</legend>
          <div className={fp}>
            <MultiSelect
              options={prodComplOptions}
              selected={prodCompl}
              onChange={setProdCompl}
              placeholder="Rechercher par nom ou référence..."
              addLabel="Ajouter un produit complémentaire"
            />
          </div>
        </fieldset>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between pb-6">
          {!isNew ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  data-testid="button-delete">
                  <Trash2 size={15} />
                  Supprimer
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le produit sera définitivement supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white">
                    Confirmer la suppression
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : <div />}

          <div className="flex gap-3">
            <button type="button" onClick={() => setLocation("/produits")}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="button-cancel">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
              data-testid="button-submit">
              {saving && <Loader2 size={15} className="animate-spin" />}
              {isNew ? "Créer le produit" : "Sauvegarder"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
