interface ReportsRequest {
  dateFrom: number;
  dateTo: number;
}

interface ReportsResponse {
  fileName: string;
  fileBase64: string;
}
