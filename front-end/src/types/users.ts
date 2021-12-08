import { User } from 'src/app/base/models/user.model';

export interface UsersGetRequest {}

export interface UsersGetResponse {
  me: User;
  user_list: User[];
}

export interface UsersPutRequest {
  username: string;
  permissions: string[];
  isLefthanded: boolean;
}

export interface UsersPutResponse {
  id: string;
  password: string;
}

export interface UsersPatchRequest {
  id: string;
  password?: string;
  permissions?: string[];
  isLefthanded?: boolean;
}

export interface UsersPatchResponse {
  status: boolean;
}
