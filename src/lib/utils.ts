import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Génère un numéro de devis lisible depuis l'_id, sans modifier la base de données.
 * Les devis sont triés par date puis par _id pour un ordre stable.
 * Exemple : DEV-2026-001
 */
export function generateNumeroDevis(
  quotes: { _id: string; date: string }[],
  devisId: string
): string {
  const sorted = [...quotes].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a._id.localeCompare(b._id);
  });
  const index = sorted.findIndex((q) => q._id === devisId);
  if (index === -1) return `DEV-${devisId.slice(-6).toUpperCase()}`;
  const year = quotes.find((q) => q._id === devisId)?.date?.substring(0, 4) ?? new Date().getFullYear();
  const seq = String(index + 1).padStart(3, "0");
  return `DEV-${year}-${seq}`;
}

/**
 * Génère un numéro de commande lisible depuis l'_id, sans modifier la base de données.
 * Les commandes sont triées par dateCommande puis par _id pour un ordre stable.
 * Exemple : CMD-2026-001
 */
export function generateNumeroCommande(
  orders: { _id: string; dateCommande: string }[],
  orderId: string
): string {
  const sorted = [...orders].sort((a, b) => {
    if (a.dateCommande !== b.dateCommande) return a.dateCommande.localeCompare(b.dateCommande);
    return a._id.localeCompare(b._id);
  });
  const index = sorted.findIndex((o) => o._id === orderId);
  if (index === -1) return `CMD-${orderId.slice(-6).toUpperCase()}`;
  const year = orders.find((o) => o._id === orderId)?.dateCommande?.substring(0, 4) ?? new Date().getFullYear();
  const seq = String(index + 1).padStart(3, "0");
  return `CMD-${year}-${seq}`;
}

/**
 * Génère un numéro de devis DEV-YYYY-NNN à partir d'une liste de commandes "En attente".
 * Utilise dateCommande comme clé de tri.
 */
export function generateNumeroDevisFromOrder(
  pendingOrders: { _id: string; dateCommande: string }[],
  orderId: string
): string {
  const sorted = [...pendingOrders].sort((a, b) => {
    if (a.dateCommande !== b.dateCommande) return a.dateCommande.localeCompare(b.dateCommande);
    return a._id.localeCompare(b._id);
  });
  const index = sorted.findIndex((o) => o._id === orderId);
  if (index === -1) return `DEV-${orderId.slice(-6).toUpperCase()}`;
  const year =
    pendingOrders.find((o) => o._id === orderId)?.dateCommande?.substring(0, 4) ??
    new Date().getFullYear();
  const seq = String(index + 1).padStart(3, "0");
  return `DEV-${year}-${seq}`;
}

/**
 * Génère un numéro d'utilisateur lisible depuis l'_id, sans modifier la base de données.
 * Les utilisateurs sont triés par dateCreation puis par _id pour un ordre stable.
 * Exemple : USR-2026-001
 */
export function generateNumeroUtilisateur(
  users: { _id?: string; dateCreation?: string }[],
  userId: string
): string {
  const sorted = [...users].sort((a, b) => {
    const da = a.dateCreation ?? "";
    const db = b.dateCreation ?? "";
    if (da !== db) return da.localeCompare(db);
    return (a._id ?? "").localeCompare(b._id ?? "");
  });
  const index = sorted.findIndex((u) => u._id === userId);
  if (index === -1) return `USR-${userId.slice(-6).toUpperCase()}`;
  const year = users.find((u) => u._id === userId)?.dateCreation?.substring(0, 4) ?? new Date().getFullYear();
  const seq = String(index + 1).padStart(3, "0");
  return `USR-${year}-${seq}`;
}
