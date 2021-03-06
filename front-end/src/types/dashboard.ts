export interface DashBoardGetRequest {}

export interface DashBoardGetResponse {
  categories: Array<{
    title: string;
    children: Array<{
      id: string;
      title: string;
      icon: string;
      description?: string;
    }>;
  }>;
}