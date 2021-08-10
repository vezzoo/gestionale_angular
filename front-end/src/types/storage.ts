export interface StorageInitRequest {}

export interface StorageInitResponse {
  items: Array<{
    id: string;
    title: string;
    price: number;
    stock: number;
    category: string;
    description?: string;
  }>;
}

export interface StorageUpdateRequest {
  editedItems: Array<{
    id: string;
    title?: string;
    price?: number;
    stock?: number;
    description?: string;
    category?: string;
  }>;
}

export interface StorageUpdateResponse {}
