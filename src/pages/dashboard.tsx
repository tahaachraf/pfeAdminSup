import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, ShoppingCart, DollarSign, Users, Truck, Folder, Tag, Layers, FileText } from "lucide-react";

export default function Dashboard() {
  const { products, orders, users, suppliers, categories, brands, modeles } = useData();

  const pendingOrders   = orders.filter((o) => o.statut === "En attente");
  const confirmedOrders = orders.filter((o) => o.statut !== "En attente");

  const totalProducts   = products.length;
  const totalOrders     = confirmedOrders.length;
  const totalQuotes     = pendingOrders.length;
  const totalRevenue    = confirmedOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const totalClients    = users.filter((u) => u.role === "client").length;
  const totalSuppliers  = suppliers.length;
  const totalCategories = categories.length;
  const totalBrands     = brands.length;
  const totalModeles    = modeles.length;

  const stats = [
    {
      title: "Total Produits",
      value: totalProducts.toString(),
      icon: Box,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Commandes",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Revenu Total (DT)",
      value: `${totalRevenue.toLocaleString("fr-TN")} DT`,
      icon: DollarSign,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      title: "Total Clients",
      value: totalClients.toString(),
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Total Fournisseurs",
      value: totalSuppliers.toString(),
      icon: Truck,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    {
      title: "Total Catégories",
      value: totalCategories.toString(),
      icon: Folder,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    {
      title: "Total Marques",
      value: totalBrands.toString(),
      icon: Tag,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      title: "Total Modèles",
      value: totalModeles.toString(),
      icon: Layers,
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
    {
      title: "Total Devis",
      value: totalQuotes.toString(),
      icon: FileText,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Bienvenue dans votre espace d'administration.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
