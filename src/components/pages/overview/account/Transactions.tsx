"use client";
import React, { useState, useEffect } from "react";
import { AppHelper } from "../../../../lib/helper";
import { useLazyFetchTransactionsQuery } from "../../../../store/services/bets.service";
import environmentConfig, {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../../../../store/services/configs/environment.config";
import DateRangeInput from "../../../inputs/DateRangeInput";
import Input from "../../../inputs/Input";
import Select from "../../../inputs/Select";
import LoadBetsLayout from "../../../layouts/LoadBetLayout";
import NavigationBar from "../../../layouts/NavigationBar";
import { CheckCheck, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { getClientTheme } from "@/config/theme.config";
import PaginatedTable from "@/components/common/PaginatedTable";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { useGetAgentUsersQuery } from "@/store/services/user.service";
import { USER_ROLES } from "@/data/enums/enum";

interface Transaction {
  id: string;
  date: string;
  transaction: string;
  betslip: string;
  credit: string;
  debit: string;
  subject: string;
  balance: string;
}

const TransactionsPage = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.transactions_page;
  // Filter states
  const [amountType, setAmountType] = useState<"all" | "credits" | "debits">(
    "all"
  );
  const [cashier, setCashier] = useState<number | null>(null);
  const { user } = useAppSelector((state) => state.user);

  const [transactionType, setTransactionType] = useState("");
  const [normalChecked, setNormalChecked] = useState(true);
  const [virtualBetsChecked, setVirtualBetsChecked] = useState(true);
  const {
    data: agent_users,
    isLoading: isLoadingAgentUsers,
    error,
  } = useGetAgentUsersQuery(
    {
      agentId: user?.id || 0,
    },
    {
      skip: !user?.id,
    }
  );
  const users = Array.isArray(agent_users?.data) ? agent_users?.data : [];

  // Set default date range: 2 days ago to today
  const getDefaultDateRange = () => {
    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    return {
      startDate: twoDaysAgo.toLocaleDateString("en-CA"), // YYYY-MM-DD format
      endDate: today.toLocaleDateString("en-CA"), // YYYY-MM-DD format
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [pageSize, setPageSize] = useState("15");
  const [currentPage, setCurrentPage] = useState(1);

  // Lazy fetch hook - will be triggered by Continue button
  const [fetchTransactions, { data, isLoading }] =
    useLazyFetchTransactionsQuery();

  // Use API data if available, otherwise use sample data
  const transactions = Array.isArray(data?.data) ? data?.data : [];

  // Pagination helpers
  const totalTransactions = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalTransactions / parseInt(pageSize)) || 1;
  const hasNextPage = data?.meta?.nextPage !== null;
  const hasPrevPage = data?.meta?.prevPage !== null;
  const nextPage = data?.meta?.nextPage;
  const prevPage = data?.meta?.prevPage;

  // Auto-fetch when filters change
  useEffect(() => {
    fetchTransactions({
      clientId: environmentConfig.CLIENT_ID!,
      endDate: dateRange.endDate,
      page_size: parseInt(pageSize),
      startDate: dateRange.startDate,
      type: amountType,
      page: currentPage,
      userId: cashier !== null ? Number(cashier) : null,
    });
  }, [dateRange, pageSize, amountType, currentPage, cashier]); // Re-fetch when any filter changes

  const handleCancel = () => {
    // Reset all filters to defaults
    setAmountType("all");
    setTransactionType("");
    setNormalChecked(true);
    setVirtualBetsChecked(true);
    setDateRange(getDefaultDateRange());
    setPageSize("15");
    setCurrentPage(1);
    // Auto-fetch will happen via useEffect
  };

  const handleContinue = () => {
    // Reset to first page when applying new filters
    setCurrentPage(1);
    // Auto-fetch will happen via useEffect

    console.log("Applying filters:", {
      amountType,
      transactionType,
      normalChecked,
      virtualBetsChecked,
      dateRange,
      pageSize,
      currentPage: 1,
    });
  };

  return (
    // <LoadBetsLayout title="Transaction List" navigationBar={<NavigationBar />}>
    <div
      className={`flex flex-col justify-between h-full p-2 gap-2 ${classes["text-primary"]}`}
    >
      {/* Filters and Actions Section - Static */}
      <div
        className={`p-2 ${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} border rounded-lg`}
      >
        {/* Transaction Filters */}
        <div className="flex gap-2">
          {/* First Row - Amounts and Transaction Type */}
          <div className="flex flex-col lg:flex-row justify-start flex-wrap items-start gap-4">
            <div className="flex justify-start items-center gap-4">
              {/* <div className="flex flex-row items-center gap-4">
                <Input
                  label="Amounts"
                  value={
                    amountType === "all"
                      ? "All"
                      : amountType === "credits"
                      ? "Credits"
                      : "Debits"
                  }
                  onChange={() => {}}
                  placeholder="All"
                  bg_color={pageClasses["input-bg"]}
                  border_color={`border ${pageClasses["input-border"]}`}
                  className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                  name={""}
                />
              </div> */}
              <div
                className={`grid 2xl:grid-cols-6 xl:grid-cols-5  lg:grid-cols-4 items-center gap-2 w-full`}
              >
                <div className={`flex flex-row items-center gap-4`}>
                  <Input
                    label="Transaction"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    placeholder="Select type"
                    bg_color={classes["input-bg"]}
                    text_color={classes["input-text"]}
                    border_color={`border ${classes["input-border"]}`}
                    className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                    name={""}
                  />
                </div>
                <div className="">
                  <Select
                    label="Page Size"
                    value={[pageSize]}
                    options={[
                      { id: "10", name: "10" },
                      { id: "15", name: "15" },
                      { id: "20", name: "20" },
                      { id: "25", name: "25" },
                      { id: "30", name: "30" },
                    ]}
                    onChange={(e) => setPageSize(e[0] as string)}
                    placeholder={""} // className="w-full"
                    className={`w-full border rounded-lg px-3 py-2 placeholder-slate-400 transition-all disabled:opacity-50`}
                  />
                </div>

                <div className={`min-w-[400px] col-span-2`}>
                  <DateRangeInput
                    label="Transaction Date"
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                {(user?.role === USER_ROLES.SUPER_ADMIN ||
                  user?.role === USER_ROLES.ADMIN) && (
                  <div className="">
                    <Select
                      label="Cashier"
                      value={cashier !== null ? [cashier.toString()] : []}
                      options={users.map((user) => ({
                        id: user.id.toString(),
                        name: user.username,
                      }))}
                      onChange={(e) => setCashier(Number(e[0]))}
                      placeholder={""} // className="w-full"
                      className={`w-full border rounded-lg px-3 py-2 placeholder-slate-400 transition-all disabled:opacity-50`}
                    />
                  </div>
                )}

                <div className="flex flex-row items-center justify-center gap-4 h-full">
                  <button
                    type="button"
                    onClick={() => setNormalChecked(!normalChecked)}
                    className="flex flex-row items-center gap-2 h-full tracking-wider translate-y-2 text-xs font-semibold"
                  >
                    <span
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                        normalChecked
                          ? `${pageClasses["checkbox-active-border"]} ${pageClasses["checkbox-active-bg"]}`
                          : pageClasses["checkbox-inactive-border"]
                      }`}
                    >
                      {normalChecked && <CheckCheck size={16} color="white" />}
                    </span>
                    <span className={``}>Normal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVirtualBetsChecked(!virtualBetsChecked)}
                    className="flex flex-row items-center gap-2 tracking-wider translate-y-2 text-xs font-semibold"
                  >
                    <span
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                        virtualBetsChecked
                          ? `${pageClasses["checkbox-active-border"]} ${pageClasses["checkbox-active-bg"]}`
                          : pageClasses["checkbox-inactive-border"]
                      }`}
                    >
                      {virtualBetsChecked && (
                        <CheckCheck size={16} color="white" />
                      )}
                    </span>
                    <span className={``}>Virtual Bets</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-between items-end pt-2">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-8">
              <div>
                <span className={`text-[11px]`}>Credit</span>
                <span className={`block font-semibold text-sm`}>0</span>
              </div>
              <div>
                <span className={`text-[11px]`}>Debit</span>
                <span className={`block font-semibold text-sm`}>0</span>
              </div>
              <div>
                <span className={`text-[11px]`}>Total Balance</span>
                <span className={`block font-semibold text-sm`}>0</span>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-row justify-between gap-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className={`${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} px-4 py-2 rounded-md text-xs h-10 flex justify-center items-center`}
            >
              <span
                className={`${pageClasses["button-secondary-text"]} font-semibold`}
              >
                Cancel
              </span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className={`${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} px-4 py-2 rounded-md text-xs h-10 flex justify-center items-center`}
              disabled={isLoading}
            >
              <span
                className={`${pageClasses["button-primary-text"]} text-center font-semibold`}
              >
                {isLoading ? "Loading..." : "Continue"}
              </span>
            </button>
          </div> */}
        </div>
      </div>
      <PaginatedTable
        columns={[
          {
            id: "id",
            name: "ID",
          },
          {
            id: "date",
            name: "Date",
            className: "col-span-3",
          },
          {
            id: "transaction",
            name: "Transaction",
            className: "col-span-2",
          },
          {
            id: "betslip",
            name: "Betslip",
            className: "col-span-2",
          },
          {
            id: "credit",
            name: "Credit",
            className: "text-green-500 col-span-2",
          },
          {
            id: "debit",
            name: "Debit",
            className: "text-red-500 col-span-2",
          },
          {
            id: "subject",
            name: "Subject",
            className: "col-span-3",
          },
          {
            id: "balance",
            name: "Balance",
            className: "col-span-2",
          },
        ]}
        className="grid-cols-[repeat(17,minmax(0,1fr))]"
        pagination={{
          total: data?.meta?.total || 0,
          perPage: parseInt(pageSize),
          currentPage: currentPage,
          lastPage: totalPages,
          nextPage: nextPage || 0,
          prevPage: prevPage || 0,
          onPageChange: (page: number) => {
            setCurrentPage(page);
          },
        }}
        data={transactions.map((transaction) => ({
          id: transaction.id,
          date: AppHelper.formatDate(transaction.transactionDate),
          transaction: transaction.description,
          betslip: transaction.referenceNo,
          credit:
            transaction.type === "credit" ? (
              <CurrencyFormatter
                amount={transaction.amount}
                className={""}
                spanClassName={""}
              />
            ) : (
              ""
            ),
          debit:
            transaction.type === "debit" ? (
              <CurrencyFormatter
                amount={transaction.amount}
                className={""}
                spanClassName={""}
              />
            ) : (
              ""
            ),
          subject: transaction.subject,
          balance: (
            <CurrencyFormatter
              amount={transaction.balance}
              className={""}
              spanClassName={""}
            />
          ),
        }))}
        isLoading={isLoading}
      />
    </div>

    // </LoadBetsLayout>
  );
};

export default TransactionsPage;
