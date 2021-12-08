export interface LoginGetRequest {
  username: string;
  password: string;
}

export interface LoginGetResponse {
  username: string;
  token: string;
  isLefthanded: boolean;
}
