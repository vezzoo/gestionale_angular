export interface CashDeskGetRequest {
  id: string;
}

export interface CashDeskGetResponse {
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

export interface CashDeskOrderConfirmRequest {
  cart: Array<{
    id: string;
    quantity?: number;
  }>;
}

export interface CashDeskOrderConfirmResponse {
  orderId: string;
}

export interface CashDeskPrintRequest {
  orderId: string;
}

export interface CashDeskPrintResponse {}
