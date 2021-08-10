interface CashDeskInitRequest {
  type: string;
}

interface CashDeskInitResponse {
  categories: Array<{
    title: string;
    childrens: Array<{
      title: string;
      price: number;
      description?: string;
      quantity?: number;
    }>;
  }>;
}

interface CashDeskSavePrintRequest {
  cart: Array<{
    title: string;
    price: number;
    description?: string;
    quantity?: number;
  }>;
}

interface CashDeskSavePrintResponse {
  status: string;
}