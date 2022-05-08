export interface PrintersListRequest {}

export interface PrintersListResponse {
  printers: Array<string>;
}

export interface PrinterStatusRequest {}

export interface PrinterStatusResponse {
  status: string;
}
