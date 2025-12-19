/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppHelper } from "@/lib/helper";
import { apiSlice } from "./constants/api.service";
import { REQUEST_ACTIONS } from "./constants/request-types";
import { WALLET_ACTIONS } from "./constants/route";
import {
  Bank,
  TransferFundsResponse,
  ValidateDepositCodeResponse,
  ValidateWithdrawCodeResponse,
  WalletBalanceResponse,
} from "./types/responses";
import {
  WithdrawVerifyDto,
  WithdrawCreateDto,
  VerifyBankAccountDto,
  BankWithdrawalDto,
  TransferFundsDto,
} from "./types/requests";
import {
  PaymentMethodsResponse,
  InitializeTransactionResponse,
  InitializeTransactionDto,
  WithdrawVerifyResponse,
  WithdrawCreateResponse,
  PendingWithdrawalsResponse,
  GetBanksResponse,
  VerifyBankAccountResponse,
  BankWithdrawalResponse,
} from "./types/responses";

const WalletApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchPaymentMethods: builder.query<PaymentMethodsResponse, void>({
      query: () => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.GET_PAYMENT_METHODS, {}),
        method: REQUEST_ACTIONS.GET,
      }),
    }),
    initializeTransaction: builder.mutation<
      InitializeTransactionResponse,
      InitializeTransactionDto
    >({
      query: (data) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.INITIALIZE_TRANSACTION, {}),
        method: REQUEST_ACTIONS.POST,
        body: data,
      }),
    }),
    verifyWithdraw: builder.mutation<
      WithdrawVerifyResponse,
      WithdrawVerifyDto & { clientId: string }
    >({
      query: ({ clientId, ...data }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.VERIFY_WITHDRAWAL, {}),
        method: REQUEST_ACTIONS.POST,
        body: data,
      }),
    }),
    createWithdraw: builder.mutation<
      WithdrawCreateResponse,
      WithdrawCreateDto & { clientId: string }
    >({
      query: ({ clientId, ...data }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.CREATE_WITHDRAWAL, {}),
        method: REQUEST_ACTIONS.POST,
        body: data,
      }),
    }),
    cancelWithdraw: builder.mutation<
      WithdrawCreateResponse,
      { clientId: string }
    >({
      query: ({ clientId }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.CANCEL_WITHDRAWAL, {}),
        method: REQUEST_ACTIONS.PATCH,
      }),
    }),
    getPendingWithdrawals: builder.query<
      PendingWithdrawalsResponse,
      { clientId: string }
    >({
      query: ({ clientId }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.PENDING_WITHDRAWALS, {}),
        method: REQUEST_ACTIONS.GET,
      }),
      // providesTags: ["Withdrawal"],
    }),
    getBanks: builder.query<Bank[], void>({
      query: () => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.GET_BANKS, {}),
        method: REQUEST_ACTIONS.GET,
      }),
      transformResponse: (response: GetBanksResponse) => {
        const res = Array.isArray(response.data) ? response.data : [];
        return res;
      },
    }),
    verifyBankAccount: builder.mutation<
      VerifyBankAccountResponse,
      VerifyBankAccountDto
    >({
      query: (data) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.VERIFY_BANK_ACCOUNT, {}),
        method: REQUEST_ACTIONS.POST,
        body: data,
      }),
    }),

    bankWithdrawal: builder.mutation<BankWithdrawalResponse, BankWithdrawalDto>(
      {
        query: ({ clientId, ...data }) => ({
          url: AppHelper.buildQueryUrl(WALLET_ACTIONS.BANK_WITHDRAWAL, {}),
          method: REQUEST_ACTIONS.POST,
          body: data,
        }),
      }
    ),
    transferFunds: builder.mutation<TransferFundsResponse, TransferFundsDto>({
      query: (body) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.TRANSFER_FUNDS, {}),
        method: REQUEST_ACTIONS.POST,
        body,
      }),
    }),
    validateCode: builder.mutation<
      ValidateWithdrawCodeResponse,
      { code: string; userRole: string }
    >({
      query: ({ code, userRole }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.VALIDATE_WITHDRAW_CODE, {}),
        method: REQUEST_ACTIONS.POST,
        body: {
          code,
          userRole,
        },
      }),
    }),
    validateDepositCode: builder.mutation<
      ValidateDepositCodeResponse,
      { code: string; userRole: string }
    >({
      query: ({ code, userRole }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.VALIDATE_DEPOSIT_CODE, {}),
        method: REQUEST_ACTIONS.POST,
        body: {
          code,
          userRole,
        },
      }),
    }),
    validateTransfer: builder.mutation<
      ValidateWithdrawCodeResponse,
      { request_id: string }
    >({
      query: ({ request_id }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.VALIDATE_TRANSFER, {
          request_id,
        }),
        method: REQUEST_ACTIONS.GET,
      }),
    }),
    validateDepositTransfer: builder.mutation<
      ValidateWithdrawCodeResponse,
      { request_id: string }
    >({
      query: ({ request_id }) => ({
        url: AppHelper.buildQueryUrl(WALLET_ACTIONS.VALIDATE_DEPOSIT_TRANSFER, {
          request_id,
        }),
        method: REQUEST_ACTIONS.GET,
      }),
    }),
    walletBalance: builder.mutation<WalletBalanceResponse, { user_id: number }>(
      {
        query: ({ user_id }) => ({
          url: AppHelper.buildQueryUrl(WALLET_ACTIONS.WALLET_BALANCE, {
            user_id,
          }),
          method: REQUEST_ACTIONS.GET,
        }),
      }
    ),
  }),
});

export const {
  useFetchPaymentMethodsQuery,
  useLazyFetchPaymentMethodsQuery,
  useInitializeTransactionMutation,
  useVerifyWithdrawMutation,
  useCreateWithdrawMutation,
  useCancelWithdrawMutation,
  useGetPendingWithdrawalsQuery,
  useLazyGetPendingWithdrawalsQuery,
  useGetBanksQuery,
  useLazyGetBanksQuery,
  useVerifyBankAccountMutation,
  useBankWithdrawalMutation,
  useTransferFundsMutation,

  useValidateCodeMutation,
  useValidateTransferMutation,
  useValidateDepositCodeMutation,
  useValidateDepositTransferMutation,
  useWalletBalanceMutation,
} = WalletApiSlice;
