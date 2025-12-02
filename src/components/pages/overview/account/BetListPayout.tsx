"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import DateRangeInput from "../../../inputs/DateRangeInput";
import { BET_STATUS_CODES } from "@/data/enums/enum";
import { AppHelper } from "../../../../lib/helper";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import { useLazyFetchBetHistoryQuery } from "../../../../store/services/bets.service";
import {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../../../../store/services/configs/environment.config";
import Select from "../../../inputs/Select";
import AccountMenu from "@/components/layouts/sidebars/AccountMenu";
import { getClientTheme } from "@/config/theme.config";
import PaginatedTable from "@/components/common/PaginatedTable";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import { MODAL_COMPONENTS, MODAL_FUNCTION_ENUM } from "@/store/features/types";
import { MdCancel } from "react-icons/md";
import { useModal } from "@/hooks/useModal";

// interface Bet {
//   betslip_id: ReactNode;
//   username: ReactNode;
//   bet_category_desc: ReactNode;
//   created(created: any): React.ReactNode;
//   stake: ReactNode;
//   status(status: any): string;
//   possible_win: ReactNode;
//   betslip: string;
//   user: string;
//   betType: string;
//   date: string;
//   resultDate: string;W
//   amount: string;
//   outcome: "winning" | "lost" | "running" | "cancelled" | "processing";
//   winnings: string;
// }

const BetListPayoutPage = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.bet_list_page;
  // Filter states
  const [dateFilter, setDateFilter] = useState("Bet");

  // Set default date range: 2 days ago to tomorrow
  const getDefaultDateRange = () => {
    const today = new Date();
    const twoDaysAgo = new Date();
    const tomorrow = new Date();

    twoDaysAgo.setDate(today.getDate() - 2);
    tomorrow.setDate(today.getDate() + 1);

    return {
      startDate: twoDaysAgo.toLocaleDateString("en-CA"), // YYYY-MM-DD format
      endDate: tomorrow.toLocaleDateString("en-CA"), // YYYY-MM-DD format (tomorrow)
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [betslip, setBetslip] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const [id, setId] = useState("");
  const [pageSize, setPageSize] = useState("15");
  const [outcome, setOutcome] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { openModal } = useModal();

  // Lazy fetch hook - will be triggered by filter changes
  const [fetchBetListPayout, { data, isLoading }] =
    useLazyFetchBetHistoryQuery();

  // Use API data if available, otherwise use empty array

  // Pagination helpers
  const totalBets = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalBets / parseInt(pageSize)) || 1;
  const hasNextPage = data?.data?.meta?.nextPage !== null;

  const bets = data?.data?.tickets || [];
  const total = data?.data?.meta?.total || 1;
  const lastPage =
    data?.data?.meta?.lastPage || Math.ceil(total / parseInt(pageSize)) || 1;
  const hasPrevPage = data?.data?.meta?.prevPage !== null;
  const nextPage = data?.data?.meta?.nextPage || 0;
  const prevPage = data?.data?.meta?.prevPage || 0;

  const handleNextPage = () => {
    if (hasNextPage && nextPage) {
      setCurrentPage(nextPage);
      // Auto-fetch when page changes
      fetchBetListPayout({
        // betslipId: betslip,
        // clientId: getEnvironmentVariable(
        //   ENVIRONMENT_VARIABLES.CLIENT_ID
        // ) as unknown as string,
        // from: dateRange.startDate,
        // to: dateRange.endDate,
        // p: nextPage,
        // status: outcome || "",
        // userId: Number(user?.id),
        page: currentPage,
      });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && prevPage) {
      setCurrentPage(prevPage);
      // Auto-fetch when page changes
      fetchBetListPayout({
        // betslipId: betslip,
        // clientId: getEnvironmentVariable(
        //   ENVIRONMENT_VARIABLES.CLIENT_ID
        // ) as unknown as string,
        // from: dateRange.startDate,
        // to: dateRange.endDate,
        // // p: prevPage,
        // status: outcome || "",
        // userId: Number(user?.id), // You might want to get this from user context
        page: prevPage,
      });
    }
  };

  // Auto-fetch when filters change
  useEffect(() => {
    fetchBetListPayout({
      // betslipId: betslip,
      // clientId: getEnvironmentVariable(
      //   ENVIRONMENT_VARIABLES.CLIENT_ID
      // ) as unknown as string,
      // from: dateRange.startDate,
      // to: dateRange.endDate,
      // p: currentPage,
      // status: outcome || "",
      // userId: Number(user?.id), // You might want to get this from user context
      page: currentPage,
    });
  }, [dateRange, pageSize, outcome, currentPage, betslip]); // Re-fetch when any filter changes

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBetListPayout({
        // betslipId: betslip,
        // clientId: getEnvironmentVariable(
        //   ENVIRONMENT_VARIABLES.CLIENT_ID
        // ) as unknown as string,
        // from: dateRange.startDate,
        // to: dateRange.endDate,
        // p: currentPage,
        // status: outcome || "",
        // userId: Number(user?.id),
        page: currentPage,
      });
    }, 15000); // 15 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [betslip, dateRange, currentPage, outcome, user?.id]); // Dependencies for the interval

  const handleCancel = () => {
    // Reset all filters to defaults
    setDateFilter("Bet");
    setDateRange(getDefaultDateRange());
    setBetslip("");
    setId("");
    setPageSize("15");
    setOutcome("");
    setCurrentPage(1);
    // Auto-fetch will happen via useEffect
  };

  const handleContinue = () => {
    // Reset to first page when applying new filters
    setCurrentPage(1);
    // Auto-fetch will happen via useEffect

    console.log("Applying filters:", {
      dateFilter,
      dateRange,
      betslip,
      id,
      pageSize,
      outcome,
      currentPage: 1,
    });
  };

  // const getOutcomeIcon = (outcome: string) => {
  //   switch (outcome) {
  //     case "cancelled":
  //       return <Ionicons name="close" size={12} color="white" />;
  //     default:
  //       return null;
  //   }
  // };

  const handleMenuPress = () => {
    // Handle menu press
    console.log("Menu pressed");
  };

  const handleSearchPress = () => {
    // Handle search press
    console.log("Search pressed");
  };

  const handleGamePress = (game: any, index: number) => {
    console.log("Game pressed:", game);
  };
  const getOutcomeColor = (outcome: number) => {
    switch (outcome) {
      case BET_STATUS_CODES.BET_WON:
        return "bg-green-500";
      case BET_STATUS_CODES.BET_LOST:
        return "bg-red-500";
      case BET_STATUS_CODES.BET_PENDING:
        return "bg-yellow-500";
      case BET_STATUS_CODES.BET_CANCELLED:
        return "bg-black";
      case BET_STATUS_CODES.BET_CASHOUT:
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const outcomeLegend = [
    { color: getOutcomeColor(BET_STATUS_CODES.BET_WON), label: "Winning" },
    { color: getOutcomeColor(BET_STATUS_CODES.BET_LOST), label: "Lost" },
    { color: getOutcomeColor(BET_STATUS_CODES.BET_PENDING), label: "Running" },
    {
      color: getOutcomeColor(BET_STATUS_CODES.BET_CANCELLED),
      label: "Cancelled",
    },
    {
      color: getOutcomeColor(BET_STATUS_CODES.BET_CASHOUT),
      label: "Processing",
    },
    {
      color: getOutcomeColor(BET_STATUS_CODES.BET_VOIDED),
      label: "Bet Voided",
    },
  ];

  console.log("startDAte", dateRange);
  return (
    // <LoadBetsLayout
    //   title={"Bet List"}
    //   // onMenuPress={handleMenuPress}
    //   // onSearchPress={handleSearchPress}
    //   navigationBar={
    //     <NavigationBar
    //       // activeTab={activeTab}
    //       // onTabPress={handleTabPress}
    //       onSearchPress={handleSearchPress}
    //     />
    //   }
    // >
    <div
      className={`w-full ${pageClasses["container-bg"]} flex flex-col gap-2 pt-2 ${classes["text-primary"]}`}
    >
      {/* Filters */}
      <div
        className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]}  p-2 rounded-md border `}
      >
        <div className="flex gap-2 items-end flex-wrap">
          {/* <div className="flex flex-col text-gray-400">
            <Input
              label="Date"
              type="text"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-700  px-3 py-2 rounded-md w-32"
              placeholder={""}
              name={""}
              height="h-[42px]"
              text_color="text-black"
            />
          </div> */}

          <div className="flex flex-col w-full max-w-[400px]">
            <DateRangeInput
              // type="date"
              value={{
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              }}
              label="Date Range"
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  startDate: e.startDate,
                  endDate: e.endDate,
                })
              }

              // className="bg-gray-700 text-white px-3 py-2 rounded-md"
            />
          </div>

          {/* <div className="flex flex-col">
              <label className="text-sm text-gray-400">To</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="bg-gray-700 text-white px-3 py-2 rounded-md"
              />
            </div> */}

          {/* <div className="flex flex-col">
              <label className="text-sm text-gray-400">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md"
              >
                {[10, 15, 20, 25, 30].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div> */}
          <div className="flex flex-row items-center gap-4">
            <div className="w-44">
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
          </div>

          {/* <div className="ml-auto flex gap-3">
            <button
              onClick={handleCancel}
              className={`${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} ${pageClasses["button-secondary-text"]} px-4 py-2 rounded-lg text-xs h-10 flex justify-center items-center`}
            >
              Cancel
            </button>
            <button
              // onClick={() => triggerFetch(1)}
              className={`${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} ${pageClasses["button-primary-text"]} px-4 py-2 rounded-lg text-xs h-10 flex justify-center items-center`}
            >
              Continue
            </button>
          </div> */}
        </div>
      </div>

      {/* Summary */}
      <div
        className={`flex justify-between items-center ${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]}  p-4 py-2 rounded-md border`}
      >
        <p className={`text-xs font-semibold`}>No. Bets: {bets.length}</p>
        <div className={`flex gap-4 text-xs tracking-wider `}>
          {outcomeLegend.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className={`w-4 h-4 ${item.color} rounded-sm`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <PaginatedTable
        columns={[
          {
            id: "idx",
            name: "",
            render: (_: any, row: any) => {
              row.outcomes === 0 &&
              AppHelper.isWithinMinutes(row.created, 5) ? (
                <td
                  className="p-1 underline cursor-pointer text-red-600"
                  onClick={() => {
                    openModal({
                      modal_name: MODAL_COMPONENTS.CONFIRMATION_MODAL,
                      ref: row.betslip_id,
                      title: "Cancel Bet",
                      description: "Are you sure you want to cancel this bet?",
                      modal_function: MODAL_FUNCTION_ENUM.CANCEL_TICKET,
                    });
                  }}
                >
                  <MdCancel fontSize={20} />
                </td>
              ) : (
                <td className="p-2"></td>
              );
            },
          },
          {
            id: "betslip_id",
            name: "Betslip",
            className: "col-span-2",
          },
          {
            id: "username",
            name: "User",
            className: "col-span-2",
          },
          {
            id: "bet_category_desc",
            name: "Bet Type",
            className: "col-span-2",
          },
          {
            id: "date",
            name: "Date",
            className: " col-span-3",
          },
          {
            id: "amount",
            name: "Amount",
            className: "col-span-2",
          },
          {
            id: "outcomes",
            name: "Outcome",
            className: "col-span-2",
            render: (_: any, row: any) => (
              <div className="px-2">
                <div
                  className={`w-4 h-4 ${getOutcomeColor(
                    row.outcomes
                  )} rounded-sm`}
                />
              </div>
            ),
          },
          {
            id: "possible_win",
            name: "Winnings",
            className: "col-span-2",
          },
        ]}
        className="grid-cols-[repeat(16,minmax(0,1fr))]"
        pagination={{
          total,
          perPage: parseInt(pageSize),
          currentPage: currentPage,
          lastPage,
          nextPage,
          prevPage,
          onPageChange: (page: number) => {
            setCurrentPage(page);
          },
        }}
        data={bets.map((bet) => ({
          idx: "",
          betslip_id: bet.betslip_id,
          date: AppHelper.formatDate(bet.created),
          username: bet.username,
          bet_category_desc: bet.bet_category_desc,
          outcomes: bet?.status,
          amount: (
            <CurrencyFormatter
              amount={bet.stake}
              className={""}
              spanClassName={""}
            />
          ),
          possible_win: (
            <CurrencyFormatter
              amount={bet.possible_win}
              className={""}
              spanClassName={""}
            />
          ),
          bet: bet,
        }))}
        isLoading={isLoading}
      />

      {/* Pagination */}
    </div>

    //  </LoadBetsLayout>
  );
};

export default BetListPayoutPage;
