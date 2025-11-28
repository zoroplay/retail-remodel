"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import DateRangeInput from "../../../inputs/DateRangeInput";
import { AppHelper } from "../../../../lib/helper";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import { useLazyFetchBetListQuery } from "../../../../store/services/bets.service";
import {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../../../../store/services/configs/environment.config";
import Select from "../../../inputs/Select";
import { getClientTheme } from "@/config/theme.config";
import { BET_STATUS_CODES } from "@/data/enums/enum";
import { useModal } from "@/hooks/useModal";
import { MODAL_COMPONENTS, MODAL_FUNCTION_ENUM } from "@/store/features/types";
import { MdCancel } from "react-icons/md";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { setBetslip as set_betlist } from "@/store/features/slice/betting.slice";

const BetListPage = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.bet_list_page;
  // Filter states
  const [dateFilter, setDateFilter] = useState("Bet");
  const { openModal } = useModal();

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
  const dispatch = useAppDispatch();
  // Lazy fetch hook - will be triggered by filter changes
  const [fetchBetList, { data, isLoading }] = useLazyFetchBetListQuery();

  // Use API data if available, otherwise use empty array
  const bets = data?.data?.tickets || [];
  const totalSales = data?.data?.totalSales || "0";
  const totalWon = data?.data?.totalWon || "0";
  console.log("data", JSON.stringify(data));

  // Pagination helpers
  const totalBets = data?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalBets / parseInt(pageSize)) || 1;
  const hasNextPage = data?.data?.meta?.nextPage !== null;
  const hasPrevPage = data?.data?.meta?.prevPage !== null;
  const nextPage = data?.data?.meta?.nextPage;
  const prevPage = data?.data?.meta?.prevPage;

  const handleNextPage = () => {
    if (hasNextPage && nextPage) {
      setCurrentPage(nextPage);
      // Auto-fetch when page changes
      fetchBetList({
        betslipId: betslip,
        clientId: getEnvironmentVariable(
          ENVIRONMENT_VARIABLES.CLIENT_ID
        ) as unknown as string,
        from: dateRange.startDate,
        to: dateRange.endDate,
        p: Number(currentPage),
        status: outcome || "",
        userId: Number(user?.id),
      });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage && prevPage) {
      setCurrentPage(prevPage);
      // Auto-fetch when page changes
      fetchBetList({
        betslipId: betslip,
        clientId: getEnvironmentVariable(
          ENVIRONMENT_VARIABLES.CLIENT_ID
        ) as unknown as string,
        from: dateRange.startDate,
        to: dateRange.endDate,
        p: Number(currentPage),
        status: outcome || "",
        userId: Number(user?.id), // You might want to get this from user context
      });
    }
  };

  // Auto-fetch when filters change
  useEffect(() => {
    fetchBetList({
      betslipId: betslip,
      clientId: getEnvironmentVariable(
        ENVIRONMENT_VARIABLES.CLIENT_ID
      ) as unknown as string,
      from: dateRange.startDate,
      to: dateRange.endDate,
      p: Number(currentPage),

      status: outcome || "",
      userId: Number(user?.id), // You might want to get this from user context
    });
  }, [dateRange, pageSize, outcome, currentPage, betslip]); // Re-fetch when any filter changes

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBetList({
        betslipId: betslip,
        clientId: getEnvironmentVariable(
          ENVIRONMENT_VARIABLES.CLIENT_ID
        ) as unknown as string,
        from: dateRange.startDate,
        to: dateRange.endDate,
        p: Number(currentPage),

        status: outcome || "",
        userId: Number(user?.id),
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
  // Map status number to readable status

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
    <div className={`w-full flex flex-col gap-2 pt-2`}>
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

          <div className="flex flex-col  w-full max-w-[400px]">
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
              font-semibold
              text_color={classes["input-text"]}
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              height="h-[36px]"
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
          <div className="flex flex-row items-center gap-4 ">
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
                bg_color={classes["input-bg"]}
                text_color={classes["input-text"]}
                border_color={`border ${classes["input-border"]}`}
                className={`w-full border ${classes["input-border"]} rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
                height="h-[36px]"
              />
            </div>
          </div>
          {/* 
          <div className="ml-auto flex gap-3">
            <button
              onClick={handleCancel}
              className={`${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} ${pageClasses["button-secondary-text"]} px-4 py-2 rounded-lg text-xs h-8 flex justify-center items-center`}
            >
              Cancel
            </button>
            <button
              // onClick={() => triggerFetch(1)}
              className={`${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} ${pageClasses["button-primary-text"]} px-4 py-2 rounded-lg text-xs h-8 flex justify-center items-center`}
            >
              Continue
            </button>
          </div> */}
        </div>
      </div>

      {/* Summary */}
      <div
        className={`flex justify-between items-center ${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} p-4 py-2 rounded-md border `}
      >
        <p className={`${pageClasses["card-text"]} text-xs font-semibold`}>
          No. Bets: {bets.length}
        </p>
        <div
          className={`flex gap-4 text-xs tracking-wider ${pageClasses["card-text"]}`}
        >
          {outcomeLegend.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className={`w-4 h-4 ${item.color} rounded-sm`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto border ${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-md`}
      >
        <table className="min-w-full text-left text-xs ">
          <thead
            className={`${classes.sports_page["header-text"]} ${classes.sports_page["header-bg"]} w-full text-xs ${pageClasses["column-header-text"]}`}
          >
            <tr>
              <th className="p-2"></th>
              <th className="p-2">Betslip</th>
              <th className="p-2">User</th>
              <th className="p-2">Bet Type</th>
              <th className="p-2">Date</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Outcome</th>
              <th className="p-2">Winnings</th>
            </tr>
          </thead>
          <tbody className={pageClasses["card-text"]}>
            {bets.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div
                      className={`w-16 h-16 ${pageClasses["input-bg"]} rounded-full flex items-center justify-center`}
                    >
                      <FileText
                        size={32}
                        className={pageClasses["card-text"]}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-base font-semibold ${pageClasses["card-text"]} mb-1`}
                      >
                        No bets found
                      </p>
                      <p
                        className={`text-sm ${pageClasses["card-text"]} opacity-60`}
                      >
                        {isLoading
                          ? "Loading..."
                          : "Try adjusting your filters or date range"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              bets.map((bet, _index) => (
                <tr
                  key={bet.betslip_id || _index}
                  className={`border-b text-xs ${pageClasses["card-border"]}  w-full border-l-transparent ${pageClasses["row-hover"]}`}
                >
                  {bet.status === 0 &&
                  AppHelper.isWithinMinutes(bet.created, 5) ? (
                    <td
                      className="p-1 underline cursor-pointer text-red-600"
                      onClick={() => {
                        openModal({
                          modal_name: MODAL_COMPONENTS.CONFIRMATION_MODAL,
                          ref: bet.betslip_id,
                          title: "Cancel Bet",
                          description:
                            "Are you sure you want to cancel this bet?",
                          modal_function: MODAL_FUNCTION_ENUM.CANCEL_TICKET,
                        });
                      }}
                    >
                      <MdCancel fontSize={20} />
                    </td>
                  ) : (
                    <td className="p-2"></td>
                  )}
                  <td
                    className="p-2 underline cursor-pointer "
                    onClick={() => {
                      openModal({
                        modal_name: MODAL_COMPONENTS.COUPON_DETAILS,
                        // ref: bet.betslip_id,
                      });
                      dispatch(set_betlist(bet));
                    }}
                  >
                    {bet.betslip_id}
                  </td>
                  <td className="p-2">{bet.username}</td>
                  <td className="p-2">{bet.bet_category_desc}</td>
                  <td className="p-2">{AppHelper.formatDate(bet.created)}</td>
                  <td className="p-2">{bet.stake}</td>
                  <td className="p-2">
                    <div
                      className={`w-4 h-4 ${getOutcomeColor(
                        bet.status
                      )} rounded-sm`}
                    />
                  </td>
                  <td className="p-2">{bet.possible_win}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={`w-full h-0.5 ${classes.betslip["divider"]}`} />
        {/* Pagination */}
        <div
          className={`flex text-[11px] font-semibold justify-between items-center px-4 p-2 ${pageClasses["card-text"]}`}
        >
          <div className="">
            Page {currentPage} of {totalPages}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-row items-center gap-4">
            <span className="">
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
                    ? `${classes["button-primary-bg"]} ${classes["button-primary-hover"]}`
                    : `${pageClasses["input-bg"]} opacity-50`
                }`}
              >
                <ChevronLeft size={20} color={hasPrevPage ? "white" : "gray"} />
              </button>

              {/* Next Page Button */}
              <button
                type="button"
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className={`p-1 rounded ${
                  hasNextPage
                    ? `${classes["button-primary-bg"]} ${classes["button-primary-hover"]}`
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

    //  </LoadBetsLayout>
  );
};

export default BetListPage;
