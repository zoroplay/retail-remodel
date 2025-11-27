import { BetSlip } from "./betting.types";

export interface GetTransactionsDto {
  clientId: string;
  endDate: string;
  page_size: number;
  startDate: string;
  type: string;
  page: number;
}
export interface GetBetListDto {
  betslipId: string;
  clientId: string;
  from: string;
  p: number;
  status: string;
  to: string;
  userId: number;
}

export interface GetTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    referenceNo: string;
    amount: number;
    balance: number;
    subject: string;
    type: string;
    description: string;
    transactionDate: string;
    channel: string;
    status: number;
    wallet: string;
  }[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
    nextPage: number;
    prevPage: number;
  };
}

export interface GetBetListResponse {
  success: boolean;
  message: string;
  data: {
    tickets: BetSlip[];
    totalSales: string;
    totalWon: string | null;
    totalCancelled: number;
    totalSalesNo: number;
    totalCancelledNo: number;
    totalWonNo: number;
    totalRunningNo: number;
    meta: {
      page: number;
      perPage: number;
      total: number;
      lastPage: number | null;
      nextPage: number;
      prevPage: number;
    };
  };
}
