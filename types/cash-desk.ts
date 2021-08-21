interface CashDeskInitRequest {
  id: string;
}

interface CashDeskInitResponse {
  categories: Array<{
    title: string;
    children: Array<{
      id: string;
      title: string;
      price: number;
      left: number;
      description?: string;
      quantity?: number;
    }>;
  }>;
}

interface CashDeskOrderConfirmRequest {
  cart: Array<{
    id: string;
    quantity?: number;
  }>;
}

interface CashDeskOrderConfirmResponse {
  orderId: string;
}

interface CashDeskPrintRequest {
  cart: Array<{
    id: string;
    quantity?: number;
  }>;
}

interface CashDeskPrintResponse {
}