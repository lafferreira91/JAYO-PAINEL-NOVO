export interface Invoice {
  id: string;
  invoiceNo: string;
  dateCreated: string;
  client: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  amount: number;
  status: 'PAID' | 'OVERDUE' | 'PENDING';
}

export interface Metric {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  iconType: 'revenue' | 'invoices' | 'clients' | 'loyalty';
}

export interface Activity {
  id: string;
  type: 'new_invoice' | 'reminder' | 'payment_received' | 'other';
  title: string;
  user?: {
    name: string;
    avatarUrl?: string;
  };
  description: string;
  time: string;
  iconBgColor: string;
}
