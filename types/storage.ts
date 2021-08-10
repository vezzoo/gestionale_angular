interface StorageInitRequest {}

interface StorageInitResponse {
  foods: Array<{
    title: string;
    price: number;
    description?: string;
    stock?: number;
    category?: string;
  }>;
}

interface StorageUpdateRequest {
  editedFoods: Array<{
    title: string;
    price: number;
    description?: string;
    stock?: number;
    category?: string;
  }>;
}

interface StorageUpdateResponse {
  status: string;
}