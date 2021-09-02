import { UserPermission } from "./permissions";

export interface DashboardCategory {
  title: string;
  children: {
      title: string;
      permissions: UserPermission[];
      icon: string;
      description: string;
  }[];
}