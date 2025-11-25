export interface DashboardSummary {
  refunds: {
    totalRefunds: number;
    totalAmount: number;
    byStatus: {
      pending: number;
      approved: number;
      rejected: number;
    };
    averageAmount: number;
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    usersWithoutRefunds: number;
  };
  clients: {
    totalClients: number;
    totalWithRefunds: number;
    totalWithoutRefunds: number;
    closedContracts: number;
  };
  generatedAt: string;
}

export interface RefundReport {
  id: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: string;
  createdAt: string;
  updatedAt: string;
  daysSinceCreation: number;
}
