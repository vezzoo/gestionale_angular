interface DashBoardRequest {}

interface DashBoardResponse {
  categories: Array<{
    title: string;
    childrens: Array<{
      title: string;
      icon: string;
      description?: string;
    }>;
  }>;
}