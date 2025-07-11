// Tu peux ajouter ici ce qui est spécifique à la gestion du dashboard vendeur,
// par exemple les stats, produits en attente, messages non lus, etc.

export interface SalesStats {
  totalSales: number;
  totalOrders: number;
  revenue: number;
}

export interface DashboardData {
  stats: SalesStats;
  recentOrders: string[]; // order IDs
  unreadMessagesCount: number;
}
