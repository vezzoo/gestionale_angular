interface StorageInitRequest {}

interface StorageInitResponse {
  items: Array<{
    id: string;
    title: string;
    price: number;
    stock: number;
    category: string;
    description?: string;
  }>;
}

interface StorageUpdateRequest {
  editedItems: Array<{
    id: string;
    title?: string;
    price?: number;
    stock?: number;
    description?: string;
    category?: string;
  }>;
}

interface StorageUpdateResponse {
}