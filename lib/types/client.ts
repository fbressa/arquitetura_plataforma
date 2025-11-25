export interface Client {
  id: string;
  companyName: string;
  cnpj?: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  companyName: string;
  contactPerson: string;
  cnpj?: string;
}

export interface UpdateClientRequest {
  companyName?: string;
  contactPerson?: string;
  cnpj?: string;
}
