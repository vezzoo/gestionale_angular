interface DashBoardGetRequest {}

interface DashBoardGetResponse {
  categories: Array<{
    title: string;
    childrens: Array<{
      id: string;
      title: string;
      icon: string;
      description?: string;
    }>;
  }>;
}