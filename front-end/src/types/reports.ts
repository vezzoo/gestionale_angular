export interface ReportsGetRequest {
  dateFrom: number;
  dateTo: number;
}

export interface ReportsGetResponse {
  fileName: string;
  fileBase64: string;
}
