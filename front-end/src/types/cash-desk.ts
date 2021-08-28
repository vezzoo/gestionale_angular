export interface CashDeskGetRequest {
  id: string;
}

export interface CashDeskGetResponse {
  categories: Array<{
    title: string;
    children: Array<{
      id: string;
      title: string;
      price: number;
      stock: number;
      description?: string;
      quantity?: number;
    }>;
  }>;
}

export interface CashDeskOrderConfirmRequest {
  cart: {
    [id: string]: number;
  };
  notes: string;
  takeAway: boolean;
}

export interface CashDeskOrderConfirmResponse {
  code: string;
  price: number;
  printList: {
    [id: string]: string;
  };
}

export interface CashDeskPrintRequest {
  orderId: string;
}

export interface CashDeskPrintResponse {}
