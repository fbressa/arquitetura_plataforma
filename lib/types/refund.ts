export interface Refund {
  id: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateRefundRequest {
  description: string;
  amount: number;
  userId: string;
}

export interface UpdateRefundRequest {
  description?: string;
  amount?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
