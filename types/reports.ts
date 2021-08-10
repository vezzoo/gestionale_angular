interface ReportsGetRequest {
  dateFrom: number;
  dateTo: number;
}

interface ReportsGetResponse {
  fileName: string;
  fileBase64: string;
}
