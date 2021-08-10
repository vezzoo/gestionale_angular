interface CashDeskGetRequest {
  id: string;
}

interface CashDeskGetResponse {
  categories: Array<{
    title: string;
    childrens: Array<{
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
  orderId: string;
}

interface CashDeskPrintResponse {}
