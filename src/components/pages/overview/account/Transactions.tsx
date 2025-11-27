"use client";
import React, { useState, useEffect } from "react";
import { AppHelper } from "../../../../lib/helper";
import { useLazyFetchTransactionsQuery } from "../../../../store/services/bets.service";
import {
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
  const [transactionType, setTransactionType] = useState("");
  const [normalChecked, setNormalChecked] = useState(true);
  const [virtualBetsChecked, setVirtualBetsChecked] = useState(true);

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

  const handleNextPage = () => {
    if (hasNextPage && nextPage) {
      setCurrentPage(nextPage);
      // Auto-fetch when page changes
      fetchTransactions({
        clientId: getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)!,
        endDate: dateRange.endDate,
        page_size: parseInt(pageSize),
        startDate: dateRange.startDate,
        type: amountType,
        page: nextPage,
      });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && prevPage) {
      setCurrentPage(prevPage);
      // Auto-fetch when page changes
      fetchTransactions({
        clientId: getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)!,
        endDate: dateRange.endDate,
        page_size: parseInt(pageSize),
        startDate: dateRange.startDate,
        type: amountType,
        page: prevPage,
      });
    }
  };

  // Auto-fetch when filters change
  useEffect(() => {
    fetchTransactions({
      clientId: getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID)!,
      endDate: dateRange.endDate,
      page_size: parseInt(pageSize),
      startDate: dateRange.startDate,
      type: amountType,
      page: currentPage,
    });
  }, [dateRange, pageSize, amountType, currentPage]); // Re-fetch when any filter changes

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
    <div className="flex flex-col justify-between h-full p-2 gap-2">
      {/* Filters and Actions Section - Static */}
      <div
        className={`p-2 ${pageClasses["card-bg"]} border border-gray-300 rounded-lg ${pageClasses["card-border"]}`}
      >
        {/* Transaction Filters */}
        <div className="flex gap-2">
          {/* First Row - Amounts and Transaction Type */}
          <div className="flex flex-col lg:flex-row justify-start flex-wrap items-start gap-2">
            <div className="flex justify-start items-center gap-2">
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
                className={`flex flex-row items-center gap-4 ${pageClasses["card-text"]}`}
              >
                <Input
                  label="Transaction"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  placeholder="Select type"
                  bg_color={pageClasses["input-bg"]}
                  border_color={`border ${pageClasses["input-border"]}`}
                  className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                  name={""}
                  height="h-[36px]"
                />
              </div>
              <div
                className={`flex flex-row items-center gap-2 w-full ${pageClasses["card-text"]}`}
              >
                <div className="w-44">
                  <Select
                    label="Page Size"
                    value={[pageSize]}
                    text_color={classes["input-text"]}
                    options={[
                      { id: "10", name: "10" },
                      { id: "15", name: "15" },
                      { id: "20", name: "20" },
                      { id: "25", name: "25" },
                      { id: "30", name: "30" },
                    ]}
                    onChange={(e) => setPageSize(e[0] as string)}
                    placeholder={""} // className="w-full"
                    height="h-[36px]"
                    bg_color={classes["input-bg"]}
                    border_color={`border ${classes["input-border"]}`}
                    className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                  />
                </div>

                <div className={`w-[400px] ${pageClasses["card-text"]}`}>
                  <DateRangeInput
                    label="Transaction Date"
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="DD/MM/YYYY"
                    bg_color={pageClasses["input-bg"]}
                    border_color={`border ${pageClasses["input-border"]}`}
                    height="h-[36px]"

                    // height="h-[42px]"
                  />
                </div>
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
                    <span className={pageClasses["card-text"]}>Normal</span>
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
                    <span className={pageClasses["card-text"]}>
                      Virtual Bets
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-between items-end">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-8">
              <div>
                <span className={`${pageClasses["label-text"]} text-[11px]`}>
                  Credit
                </span>
                <span
                  className={`block ${pageClasses["value-text"]} font-semibold text-sm`}
                >
                  0
                </span>
              </div>
              <div>
                <span className={`${pageClasses["label-text"]} text-[11px]`}>
                  Debit
                </span>
                <span
                  className={`block ${pageClasses["value-text"]} font-semibold text-sm`}
                >
                  0
                </span>
              </div>
              <div>
                <span className={`${pageClasses["label-text"]} text-[11px]`}>
                  Total Balance
                </span>
                <span
                  className={`block ${pageClasses["value-text"]} font-semibold text-sm`}
                >
                  0
                </span>
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

      {/* Transaction Table - Scrollable Section */}
      <div
        className={`${pageClasses["card-bg"]} flex flex-col h-full border ${pageClasses["card-border"]}`}
      >
        {/* Table Header - Static */}
        <div className={`${pageClasses["column-header-bg"]} text-xs px-4 py-2`}>
          <div className="flex flex-row">
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-24`}
            >
              ID
            </span>
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-52`}
            >
              Date
            </span>
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-44`}
            >
              Transaction
            </span>
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-24`}
            >
              Betslip
            </span>
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-20`}
            >
              Credit
            </span>
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-20`}
            >
              Debit
            </span>
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-44`}
            >
              Subject
            </span>
            <span
              className={`${pageClasses["column-header-text"]} font-semibold w-28`}
            >
              Balance
            </span>
          </div>
        </div>

        {/* Table Rows - Scrollable */}
        <div className="flex-1 h-full overflow-y-auto">
          {transactions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-10">
              <div
                className={`w-14 h-14 ${pageClasses["input-bg"]} rounded-full flex items-center justify-center`}
              >
                <FileText size={26} className={pageClasses["row-text"]} />
              </div>
              <div className="text-center">
                <p
                  className={`text-base font-semibold ${pageClasses["row-text"]} mb-1`}
                >
                  No transactions found
                </p>
                <p className={`text-xs ${pageClasses["row-text"]} opacity-60`}>
                  {isLoading
                    ? "Loading..."
                    : "Try adjusting your filters or date range"}
                </p>
              </div>
            </div>
          ) : (
            transactions?.map((transaction: any, index: number) => (
              <div
                key={transaction.id}
                className={`border-b border-l-4 border-l-transparent hover:border-l-blue-500/80 ${pageClasses["card-border"]}`}
              >
                <div
                  className={`flex flex-row p-2 ${pageClasses["row-hover"]}`}
                >
                  <div className="w-24 flex flex-row items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 inline-block" />
                    <span
                      className={`${pageClasses["row-text"]} text-xs font-medium`}
                    >
                      {transaction.id}
                    </span>
                  </div>
                  <span className={`${pageClasses["row-text"]} text-xs w-52`}>
                    {AppHelper.formatDate(transaction.transactionDate)}
                  </span>
                  <span className={`${pageClasses["row-text"]} text-xs w-44`}>
                    {transaction.description}
                  </span>
                  <span className={`${pageClasses["row-text"]} text-xs w-24`}>
                    {transaction.referenceNo}
                  </span>
                  <span
                    className={`${pageClasses["credit-text"]} text-xs w-20 font-medium`}
                  >
                    {transaction.type === "credit"
                      ? transaction?.amount.toFixed(2)
                      : ""}
                  </span>
                  <span
                    className={`${pageClasses["debit-text"]} text-xs w-20 font-medium`}
                  >
                    {transaction.type === "debit"
                      ? transaction?.amount.toFixed(2)
                      : ""}
                  </span>
                  <span className={`${pageClasses["row-text"]} text-xs w-44`}>
                    {transaction.subject}
                  </span>
                  <span
                    className={`${pageClasses["row-text"]} text-xs w-28 font-medium`}
                  >
                    {transaction.balance?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Footer - Static */}
        <div className={`${pageClasses["footer-bg"]} px-4 py-2`}>
          <div className="flex flex-row justify-between items-center">
            <span
              className={`${pageClasses["card-text"]} font-semibold text-xs`}
            >
              Number of rows: {transactions?.length}
            </span>

            {/* Pagination Controls */}
            <div className="flex flex-row items-center gap-4">
              <span className={`${pageClasses["card-text"]} text-xs`}>
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex flex-row items-center gap-2">
                {/* Previous Page Button */}
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage}
                  className={`p-1 rounded ${
                    hasPrevPage
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["input-bg"]} opacity-50`
                  }`}
                >
                  <ChevronLeft
                    size={20}
                    color={hasPrevPage ? "white" : "gray"}
                  />
                </button>

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className={`p-1 rounded ${
                    hasNextPage
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["input-bg"]} opacity-50`
                  }`}
                >
                  <ChevronRight
                    size={20}
                    color={hasNextPage ? "white" : "gray"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // </LoadBetsLayout>
  );
};

export default TransactionsPage;
