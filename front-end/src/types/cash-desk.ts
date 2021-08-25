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
      left: number;
      description?: string;
      quantity?: number;
    }>;
  }>;
}

export interface CashDeskOrderConfirmRequest {
  cart: {
    [id: string]: number;
  };
}

export interface CashDeskOrderConfirmResponse {
  code: string;
  price: number;
  printLists: {
    [id: string]: string;
  };
}

export interface CashDeskPrintRequest {
  orderId: string;
}

export interface CashDeskPrintResponse {}
