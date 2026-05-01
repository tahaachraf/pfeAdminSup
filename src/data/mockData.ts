export type User = {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  dateCreation?: string;
};

export type Product = {
  _id: string;
  reference: string;
  nom: string;
  cout: number;
  prix: number;
  titreSite: string;
  slug: string;
  description: string;
  descriptionSupplementaire: string;
  metaDescription: string;
  motsClesMeta: string;
  poids: number;
  quantiteStock: number;
  delaiLivraison: number;
  categorie: string;
  promotion: boolean;
  afficherLaQuantiteDispo: boolean;
  statutProduit: string;
};

export type Category = {
  _id: string;
  nom: string;
  slug: string;
  description: string;
  metaDescription: string;
  metaKeywords: string;
  categorieParent: string | null;
};

export type Order = {
  _id: string;
  client: string;
  total: number;
  statut: string;
  dateCommande: string;
  produits?: OrderProduct[];
};

export type OrderProduct = {
  _id: string;
  id_commande: string;
  id_produit: string;
  quantite: number;
  prixUnitaire: number;
};

export type SupplierCreePar = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
};

export type Supplier = {
  _id: string;
  nom: string;
  tel: string;
  email: string;
  siteWeb: string;
  creePar?: SupplierCreePar | string;
  dateCreation?: string;
};

export type Brand = {
  _id: string;
  nom: string;
  slug: string;
  dateCreation: string;
};

export type Modele = {
  _id: string;
  nom: string;
  slug: string;
  idMarque: string;
  dateCreation: string;
};

export type QuoteProduct = {
  _id: string;
  id_devis: string;
  id_produit: string;
};

export type Quote = {
  _id: string;
  client: string;
  adminMarketing: string;
  date: string;
  produits?: QuoteProduct[];
};

export type Payment = {
  _id: string;
  numeroCommande: string;
  montant: number;
  methode: string;
  statut: string;
  date: string;
};

export const initialProducts: Product[] = [
  { _id: "6994d7b90305919909b4b7c4", reference: "DXPS13", nom: "Ordinateur portable Dell XPS 13", cout: 900, prix: 1200, titreSite: "", slug: "ordinateur-portable-dell-xps-13", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 1.5, quantiteStock: 10, delaiLivraison: 3, categorie: "HIGH TECH/Ordinateurs", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69b07e5ad7a071d349acf0a2", reference: "LOGM185", nom: "Souris sans fil Logitech M185", cout: 10, prix: 25, titreSite: "", slug: "souris-sans-fil-logitech-m185", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 0.1, quantiteStock: 50, delaiLivraison: 2, categorie: "HIGH TECH/Accessoires High Tech", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69be6f5280a12dc94e0ad322", reference: "HP25RG10U", nom: "PC portable HP 250r G10 Core 5", cout: 2000, prix: 2299, titreSite: "", slug: "pc-portable-hp-250r-g10", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 2.1, quantiteStock: 5, delaiLivraison: 5, categorie: "HIGH TECH/Ordinateurs", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69be748d80a12dc94e0ad328", reference: "PC115J17", nom: "PC portable Lenovo Ideapad 1 15IJL7", cout: 900, prix: 1000, titreSite: "", slug: "pc-portable-lenovo-ideapad-1", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 1.8, quantiteStock: 8, delaiLivraison: 4, categorie: "HIGH TECH/Ordinateurs", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69be8a1780a12dc94e0ad32c", reference: "SMA24128", nom: "Smartphone Samsung Galaxy A24 8Go 128Go Noir", cout: 700, prix: 830, titreSite: "", slug: "smartphone-samsung-galaxy-a24", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 0.2, quantiteStock: 20, delaiLivraison: 2, categorie: "HIGH TECH/Smartphones", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69be8c8180a12dc94e0ad32e", reference: "SMOPPO7128", nom: "Smartphone Oppo A76 6Go 128Go Bleu", cout: 700, prix: 830, titreSite: "", slug: "smartphone-oppo-a76", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 0.2, quantiteStock: 15, delaiLivraison: 2, categorie: "HIGH TECH/Smartphones", promotion: true, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69be913180a12dc94e0ad332", reference: "TBLT19101", nom: "Tablette Bmax MaxPad i9 Plus 10.1 WiFi Gris", cout: 175, prix: 225, titreSite: "", slug: "tablette-bmax-maxpad-i9", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 0.5, quantiteStock: 12, delaiLivraison: 3, categorie: "HIGH TECH/Tablettes", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69bea1b680a12dc94e0ad336", reference: "TVVEGA55NRK4", nom: "TV Vega 55 Smart QLED UHD 4K Noir", cout: 1230, prix: 1470, titreSite: "", slug: "tv-vega-55-qled", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 15, quantiteStock: 3, delaiLivraison: 7, categorie: "HIGH TECH/TV et Vidéo/Télévisions", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "actif" },
  { _id: "69bea3d980a12dc94e0ad338", reference: "TVTFK55NRK4", nom: "TV Telefunken 55 QLED G4E Google TV 4K", cout: 1530, prix: 1400, titreSite: "", slug: "tv-telefunken-55-qled", description: "", descriptionSupplementaire: "", metaDescription: "", motsClesMeta: "", poids: 15, quantiteStock: 2, delaiLivraison: 7, categorie: "HIGH TECH/TV et Vidéo/Télévisions", promotion: false, afficherLaQuantiteDispo: true, statutProduit: "inactif" }
];

export const initialCategories: Category[] = [
  { _id: "cat001", nom: "HIGH TECH", slug: "high-tech", description: "", metaDescription: "", metaKeywords: "", categorieParent: null },
  { _id: "cat002", nom: "ÉLECTROMÉNAGER", slug: "electromenager", description: "", metaDescription: "", metaKeywords: "", categorieParent: null },
  { _id: "cat003", nom: "PRÊT-À-PORTER", slug: "pret-a-porter", description: "", metaDescription: "", metaKeywords: "", categorieParent: null },
  { _id: "cat004", nom: "PIÈCES MÉCANIQUES ADAPTABLES", slug: "pieces-mecaniques-adaptables", description: "", metaDescription: "", metaKeywords: "", categorieParent: null },
  { _id: "cat005", nom: "Ordinateurs", slug: "ordinateurs", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat001" },
  { _id: "cat006", nom: "Accessoires ordinateurs", slug: "accessoires-ordinateurs", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat005" },
  { _id: "cat007", nom: "Smartphones", slug: "smartphones", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat001" },
  { _id: "cat008", nom: "Tablettes", slug: "tablettes", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat001" },
  { _id: "cat009", nom: "Accessoires High Tech", slug: "accessoires-high-tech", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat001" },
  { _id: "cat010", nom: "Accessoires smartphones", slug: "accessoires-smartphones", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat009" },
  { _id: "cat011", nom: "Accessoires tablettes", slug: "accessoires-tablettes", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat009" },
  { _id: "cat012", nom: "Accessoires caméras", slug: "accessoires-cameras", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat009" },
  { _id: "cat013", nom: "Accessoires TV", slug: "accessoires-tv", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat009" },
  { _id: "cat014", nom: "TV et Vidéo", slug: "tv-et-video", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat001" },
  { _id: "cat015", nom: "Télévisions", slug: "televisions", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat014" },
  { _id: "cat016", nom: "Vidéoprojecteurs", slug: "videoprojecteurs", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat014" },
  { _id: "cat017", nom: "Lecteurs vidéo", slug: "lecteurs-video", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat014" },
  { _id: "cat018", nom: "Caméras & Photo", slug: "cameras-photo", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat001" },
  { _id: "cat019", nom: "Appareils photo", slug: "appareils-photo", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat018" },
  { _id: "cat020", nom: "Caméras", slug: "cameras", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat018" },
  { _id: "cat021", nom: "Caméras de surveillance", slug: "cameras-surveillance", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat018" },
  { _id: "cat022", nom: "Réfrigérateurs", slug: "refrigerateurs", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat002" },
  { _id: "cat023", nom: "Congélateurs", slug: "congelateurs", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat002" },
  { _id: "cat024", nom: "Machine à laver", slug: "machine-a-laver", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat002" },
  { _id: "cat025", nom: "Four", slug: "four", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat002" },
  { _id: "cat026", nom: "Micro Onde", slug: "micro-onde", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat002" },
  { _id: "cat027", nom: "Cuisinière", slug: "cuisiniere", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat002" },
  { _id: "cat028", nom: "Accessoires Électroménager", slug: "accessoires-electromenager", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat002" },
  { _id: "cat029", nom: "Femme", slug: "femme", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat003" },
  { _id: "cat030", nom: "Robes", slug: "robes", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat029" },
  { _id: "cat031", nom: "Chemisiers & Blouses", slug: "chemisiers-blouses", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat029" },
  { _id: "cat032", nom: "T-shirts & Sweats", slug: "tshirts-sweats-femme", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat029" },
  { _id: "cat033", nom: "Vestes & Manteaux", slug: "vestes-manteaux-femme", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat029" },
  { _id: "cat034", nom: "Jeans & Pantalons", slug: "jeans-pantalons-femme", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat029" },
  { _id: "cat035", nom: "Lingerie & Nuit", slug: "lingerie-nuit", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat029" },
  { _id: "cat036", nom: "Homme", slug: "homme", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat003" },
  { _id: "cat037", nom: "Chemises", slug: "chemises", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat036" },
  { _id: "cat038", nom: "T-shirts & Polos", slug: "tshirts-polos", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat036" },
  { _id: "cat039", nom: "Sweats & Hoodies", slug: "sweats-hoodies", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat036" },
  { _id: "cat040", nom: "Vestes & Manteaux", slug: "vestes-manteaux-homme", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat036" },
  { _id: "cat041", nom: "Jeans & Pantalons", slug: "jeans-pantalons-homme", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat036" },
  { _id: "cat042", nom: "Costumes", slug: "costumes", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat036" },
  { _id: "cat043", nom: "Sous-vêtements", slug: "sous-vetements", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat036" },
  { _id: "cat044", nom: "Enfant", slug: "enfant", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat003" },
  { _id: "cat045", nom: "Fille", slug: "fille", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat044" },
  { _id: "cat046", nom: "Garçon", slug: "garcon", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat044" },
  { _id: "cat047", nom: "Bébé", slug: "bebe", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat044" },
  { _id: "cat048", nom: "Accessoires mode", slug: "accessoires-mode", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat003" },
  { _id: "cat049", nom: "Pièces tracteur adaptables", slug: "pieces-tracteur-adaptables", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat004" },
  { _id: "cat050", nom: "Pièces voiture adaptables", slug: "pieces-voiture-adaptables", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat004" },
  { _id: "cat051", nom: "Pièces camion adaptables", slug: "pieces-camion-adaptables", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat004" },
  { _id: "cat052", nom: "Pièces vélo adaptables", slug: "pieces-velo-adaptables", description: "", metaDescription: "", metaKeywords: "", categorieParent: "cat004" }
];

export const initialUsers: User[] = [
  { _id: "6994ce03", nom: "Ahmed", prenom: "Ali", email: "ahmed@email.com", role: "client", dateCreation: "2026-03-09" },
  { _id: "69b08836", nom: "Admin", prenom: "Super", email: "superadmin@email.com", role: "superAdmin", dateCreation: "2026-03-09" },
  { _id: "69b08878", nom: "Admin", prenom: "Marketing", email: "adminmarketing@email.com", role: "adminMarketing", dateCreation: "2026-03-09" },
  { _id: "69b088b4", nom: "Admin", prenom: "Achat", email: "adminachat@email.com", role: "adminAchat", dateCreation: "2026-03-09" },
  { _id: "69baafb3", nom: "Marwan", prenom: "Hamdi", email: "marwan.hamdi@email.com", role: "client", dateCreation: "2026-03-18" }
];

export const initialOrders: Order[] = [
  { _id: "6994e60b", client: "Ahmed Ali", total: 1225, statut: "En attente", dateCommande: "2026-03-10" },
  { _id: "69bab151", client: "Marwan Hamdi", total: 1000, statut: "En attente", dateCommande: "2026-03-18" }
];

export const initialOrderProducts: OrderProduct[] = [
  { _id: "69b09f596d46648035275fcc", id_commande: "6994e60b", id_produit: "6994d7b90305919909b4b7c4", quantite: 1, prixUnitaire: 1200 },
  { _id: "69b09f596d46648035275fcd", id_commande: "6994e60b", id_produit: "69b07e5ad7a071d349acf0a2", quantite: 1, prixUnitaire: 25 },
  { _id: "69b09f596d46648035275fce", id_commande: "69bab151", id_produit: "69be748d80a12dc94e0ad328", quantite: 1, prixUnitaire: 1000 }
];

export const initialSuppliers: Supplier[] = [];

export const initialModeles: Modele[] = [
  { _id: "mod001", nom: "XPS 13", slug: "xps-13", idMarque: "mar001", dateCreation: "2026-03-09" },
  { _id: "mod002", nom: "XPS 15", slug: "xps-15", idMarque: "mar001", dateCreation: "2026-03-09" },
  { _id: "mod003", nom: "M185", slug: "m185", idMarque: "mar002", dateCreation: "2026-03-09" },
  { _id: "mod004", nom: "MX Master 3", slug: "mx-master-3", idMarque: "mar002", dateCreation: "2026-03-09" },
  { _id: "mod005", nom: "250 G10", slug: "250-g10", idMarque: "mar003", dateCreation: "2026-03-09" },
  { _id: "mod006", nom: "Pavilion 15", slug: "pavilion-15", idMarque: "mar003", dateCreation: "2026-03-09" },
  { _id: "mod007", nom: "IdeaPad 1", slug: "ideapad-1", idMarque: "mar004", dateCreation: "2026-03-09" },
  { _id: "mod008", nom: "ThinkPad E14", slug: "thinkpad-e14", idMarque: "mar004", dateCreation: "2026-03-09" },
  { _id: "mod009", nom: "Galaxy A24", slug: "galaxy-a24", idMarque: "mar005", dateCreation: "2026-03-09" },
  { _id: "mod010", nom: "Galaxy S24", slug: "galaxy-s24", idMarque: "mar005", dateCreation: "2026-03-09" },
  { _id: "mod011", nom: "A76", slug: "a76", idMarque: "mar006", dateCreation: "2026-03-09" },
  { _id: "mod012", nom: "MaxPad I9 Plus", slug: "maxpad-i9-plus", idMarque: "mar007", dateCreation: "2026-03-09" },
];

export const initialBrands: Brand[] = [
  { _id: "mar001", nom: "Dell", slug: "dell", dateCreation: "2026-03-09" },
  { _id: "mar002", nom: "Logitech", slug: "logitech", dateCreation: "2026-03-09" },
  { _id: "mar003", nom: "HP", slug: "hp", dateCreation: "2026-03-09" },
  { _id: "mar004", nom: "Lenovo", slug: "lenovo", dateCreation: "2026-03-09" },
  { _id: "mar005", nom: "Samsung", slug: "samsung", dateCreation: "2026-03-09" },
  { _id: "mar006", nom: "Oppo", slug: "oppo", dateCreation: "2026-03-09" },
  { _id: "mar007", nom: "Bmax", slug: "bmax", dateCreation: "2026-03-09" },
  { _id: "mar008", nom: "Lesia", slug: "lesia", dateCreation: "2026-03-09" },
  { _id: "mar009", nom: "Vega", slug: "vega", dateCreation: "2026-03-09" },
  { _id: "mar010", nom: "Telefunken", slug: "telefunken", dateCreation: "2026-03-09" },
  { _id: "mar011", nom: "Dahua", slug: "dahua", dateCreation: "2026-03-09" },
  { _id: "mar012", nom: "Imou", slug: "imou", dateCreation: "2026-03-09" },
  { _id: "mar013", nom: "Havit", slug: "havit", dateCreation: "2026-03-09" },
  { _id: "mar014", nom: "Sharp", slug: "sharp", dateCreation: "2026-03-09" },
  { _id: "mar015", nom: "Fujifilm", slug: "fujifilm", dateCreation: "2026-03-09" }
];

export const initialQuotes: Quote[] = [
  { _id: "dev001", client: "Ahmed Ali", adminMarketing: "Admin Marketing", date: "2026-03-10" },
  { _id: "dev002", client: "Marwan Hamdi", adminMarketing: "Admin Marketing", date: "2026-03-18" }
];

export const initialQuoteProducts: QuoteProduct[] = [
  { _id: "69b090a4d7a071d349acf0d0", id_devis: "dev001", id_produit: "6994d7b90305919909b4b7c4" },
  { _id: "69b090a4d7a071d349acf0d1", id_devis: "dev001", id_produit: "69b07e5ad7a071d349acf0a2" },
  { _id: "69b090a4d7a071d349acf0d2", id_devis: "dev002", id_produit: "69be6f5280a12dc94e0ad322" }
];

export const initialPayments: Payment[] = [
  { _id: "pay001", numeroCommande: "6994e60b", montant: 1225, methode: "carte", statut: "valide", date: "2026-03-10" },
  { _id: "pay002", numeroCommande: "69bab151", montant: 1000, methode: "cash", statut: "en_attente", date: "2026-03-18" }
];
