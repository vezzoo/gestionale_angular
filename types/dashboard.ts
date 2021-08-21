interface DashBoardRequest {}

interface DashBoardResponse {
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