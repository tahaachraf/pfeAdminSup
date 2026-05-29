import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Product,
  Category,
  User,
  Order,
  Supplier,
  Brand,
  Modele,
  Quote,
} from "@/data/mockData";
import { api } from "@/lib/api";

interface DataContextType {
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;
  categories: Category[];
  categoriesLoading: boolean;
  refreshCategories: () => Promise<void>;
  users: User[];
  usersLoading: boolean;
  refreshUsers: () => Promise<void>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  ordersLoading: boolean;
  refreshOrders: () => Promise<void>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  suppliersLoading: boolean;
  refreshSuppliers: () => Promise<void>;
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  brandsLoading: boolean;
  refreshBrands: () => Promise<void>;
  modeles: Modele[];
  setModeles: React.Dispatch<React.SetStateAction<Modele[]>>;
  modelesLoading: boolean;
  refreshModeles: () => Promise<void>;
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  quotesLoading: boolean;
  refreshQuotes: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(true);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const [modeles, setModeles] = useState<Modele[]>([]);
  const [modelesLoading, setModelesLoading] = useState(true);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);


  const refreshProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await api.get<any[]>("/produits");
      const normalized = data.map((p) => ({
        ...p,
        categorie:
          p.categorie && typeof p.categorie === "object"
            ? p.categorie._id ?? ""
            : p.categorie ?? "",
      }));
      setProducts(normalized as Product[]);
    } catch {
      // API non disponible
    } finally {
      setProductsLoading(false);
    }
  };

  const refreshCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await api.get<any[]>("/categories");
      const normalized = data.map((c) => ({
        ...c,
        categorieParent:
          c.categorieParent && typeof c.categorieParent === "object"
            ? c.categorieParent._id ?? null
            : c.categorieParent ?? null,
      }));
      setCategories(normalized as Category[]);
    } catch {
      // API non disponible
    } finally {
      setCategoriesLoading(false);
    }
  };

  const refreshUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await api.get<User[]>("/users");
      setUsers(data);
    } catch {
      // API non disponible
    } finally {
      setUsersLoading(false);
    }
  };

  const refreshOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await api.get<any[]>("/commandes");
      const normalized: Order[] = data.map((d) => {
        const clientId = d.clientId;
        const nomClient =
          clientId && typeof clientId === "object"
            ? `${clientId.nom ?? ""} ${clientId.prenom ?? ""}`.trim() || clientId.email || "—"
            : "—";
        return {
          _id: d._id,
          client: nomClient,
          total: d.total ?? 0,
          statut: d.statut ?? "—",
          dateCommande: d.dateCommande ? d.dateCommande.substring(0, 10) : "—",
        };
      });
      setOrders(normalized);
    } catch {
      // API non disponible
    } finally {
      setOrdersLoading(false);
    }
  };

  const refreshSuppliers = async () => {
    setSuppliersLoading(true);
    try {
      const data = await api.get<Supplier[]>("/fournisseurs");
      setSuppliers(data);
    } catch {
      // API non disponible
    } finally {
      setSuppliersLoading(false);
    }
  };

  const refreshBrands = async () => {
    setBrandsLoading(true);
    try {
      const data = await api.get<Brand[]>("/marques");
      setBrands(data);
    } catch {
      // API non disponible
    } finally {
      setBrandsLoading(false);
    }
  };

  const refreshModeles = async () => {
    setModelesLoading(true);
    try {
      const data = await api.get<Modele[]>("/models");
      setModeles(data);
    } catch {
      // API non disponible
    } finally {
      setModelesLoading(false);
    }
  };

  const refreshQuotes = async () => {
    setQuotesLoading(true);
    try {
      const data = await api.get<any[]>("/devis");
      const normalized: Quote[] = data.map((d) => {
        const clientId = d.clientId;
        const adminId = d.adminMarketingId;
        const nomClient =
          clientId && typeof clientId === "object"
            ? `${clientId.nom ?? ""} ${clientId.prenom ?? ""}`.trim() || clientId.email || "—"
            : "—";
        const nomAdmin =
          adminId && typeof adminId === "object"
            ? `${adminId.nom ?? ""} ${adminId.prenom ?? ""}`.trim() || adminId.email || "—"
            : "—";
        return {
          _id: d._id,
          client: nomClient,
          adminMarketing: nomAdmin,
          date: d.dateDevis ? d.dateDevis.substring(0, 10) : "—",
        };
      });
      setQuotes(normalized);
    } catch {
      // API non disponible
    } finally {
      setQuotesLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshCategories();
    refreshUsers();
    refreshOrders();
    refreshSuppliers();
    refreshBrands();
    refreshModeles();
    refreshQuotes();
  }, []);

  return (
    <DataContext.Provider
      value={{
        products,
        productsLoading,
        refreshProducts,
        categories,
        categoriesLoading,
        refreshCategories,
        users,
        usersLoading,
        refreshUsers,
        orders,
        setOrders,
        ordersLoading,
        refreshOrders,
        suppliers,
        setSuppliers,
        suppliersLoading,
        refreshSuppliers,
        brands,
        setBrands,
        brandsLoading,
        refreshBrands,
        modeles,
        setModeles,
        modelesLoading,
        refreshModeles,
        quotes,
        setQuotes,
        quotesLoading,
        refreshQuotes,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
