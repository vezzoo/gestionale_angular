import { Product } from 'src/app/base/models/product.model';

export interface StorageGetRequest {}

export interface StorageGetResponse {
  categories: Array<{
    title: string;
    children: Array<Product>;
  }>;
}

export interface StoragePutRequest {
  title: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
}

export interface StoragePutResponse {
  status: boolean;
}

export interface StoragePatchRequest {
  editedItems: Array<Product>;
}

export interface StoragePatchResponse {
  [id: string]: {
    status: boolean;
  };
}
