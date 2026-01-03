"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import environmentConfig from "@/store/services/configs/environment.config";
import Select from "../../../inputs/Select";
import { getClientTheme } from "@/config/theme.config";
import { BET_STATUS_CODES, USER_ROLES } from "@/data/enums/enum";
import { useModal } from "@/hooks/useModal";
import { MODAL_COMPONENTS, MODAL_FUNCTION_ENUM } from "@/store/features/types";
import { MdCancel } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { setBetslip as set_betlist } from "@/store/features/slice/betting.slice";
import PaginatedTable from "@/components/common/PaginatedTable";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import { useUserRetailDataQuery } from "@/store/services/user.service";
import DateRangeInput from "@/components/inputs/DateRangeInput";
import { AppHelper } from "@/lib/helper";

const OnlineReport = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.bet_list_page;
  // Filter states
  const [dateFilter, setDateFilter] = useState("Bet");
  const { openModal } = useModal();
  const [cashier, setCashier] = useState<number | null>(null);
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
  const {
    data: agent_data,
    isLoading,
    error,
    refetch,
  } = useUserRetailDataQuery(
    {
      agentId: user?.id || 0,
      clientId: Number(environmentConfig.CLIENT_ID),
      from: dateRange.startDate,
      to: dateRange.endDate,
      // from: "",
      // to: "",
    },
    {
      skip: !user?.id,
    }
  );
  const users = Array.isArray(agent_data?.data) ? agent_data?.data : [];

  const bets = agent_data?.data?.tickets || [];
  const total = agent_data?.data?.meta?.total || 1;
  const lastPage =
    agent_data?.data?.meta?.lastPage ||
    Math.ceil(total / parseInt(pageSize)) ||
    1;
  const hasPrevPage = agent_data?.data?.meta?.prevPage !== null;
  const nextPage = agent_data?.data?.meta?.nextPage || 0;
  const prevPage = agent_data?.data?.meta?.prevPage || 0;

  // Auto-fetch when filters change
  useEffect(() => {
    refetch();
  }, [dateRange, pageSize, outcome, currentPage, betslip, cashier]); // Re-fetch when any filter changes

  // // Auto-refresh every 15 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchBetList({
  //       betslipId: betslip,
  //       perPage: Number(pageSize),
  //       from: dateRange.startDate,
  //       to: dateRange.endDate,
  //       p: Number(currentPage),

  //       status: outcome || "",
  //       userId: Number(user?.id),
  //     });
  //   }, 15000); // 15 seconds

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(interval);
  // }, [betslip, dateRange, currentPage, outcome, user?.id]); // Dependencies for the interval

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
        return "bg-green-500 border border-green-300";
      case BET_STATUS_CODES.BET_LOST:
        return "bg-red-500 border border-red-300";
      case BET_STATUS_CODES.BET_PENDING:
        return "bg-yellow-500 border border-yellow-300";
      case BET_STATUS_CODES.BET_CANCELLED:
        return "bg-black border border-gray-700";
      case BET_STATUS_CODES.BET_CASHOUT:
        return "bg-orange-500 border border-orange-300";
      default:
        return "bg-gray-500 border border-gray-300";
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
      className={`w-full flex flex-col gap-2 pt-2 ${classes["text-primary"]}`}
    >
      {/* Filters */}
      <div
        className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]}  p-2 rounded-md border `}
      >
        <div className="grid grid-cols-4 gap-2 items-end flex-wrap">
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

          <div className="flex flex-col col-span-2 w-full min--w-[400px]">
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
            />
          </div>

          <div className="flex flex-row items-center gap-4 ">
            <div className="w-full">
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
                className={`w-full border rounded-lg px-3 py-2 ${classes["input-text"]} placeholder-slate-400 transition-all disabled:opacity-50`}
              />
            </div>
          </div>
          {/* {(user?.role === USER_ROLES.SUPER_ADMIN ||
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
          )} */}
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
        <p className={`text-xs font-semibold`}>No. Bets: {bets.length}</p>
        <div className={`flex gap-4 text-xs tracking-wider`}>
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
            render: (_: any, row: any) =>
              row.outcomes === 0 &&
              AppHelper.isWithinMinutes(row?.bet?.created, 5) ? (
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
              ),
          },
          {
            id: "betslip_id",
            name: "Betslip",
            className: "col-span-2",
            render: (_: any, row: any) => (
              <div
                onClick={() => {
                  openModal({
                    modal_name: MODAL_COMPONENTS.COUPON_DETAILS,
                    // ref: bet.betslip_id,
                  });
                  dispatch(set_betlist(row?.bet));
                }}
                className="underline cursor-pointer"
              >
                {row.betslip_id}
              </div>
            ),
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
        data={agent_data?.data?.data.map((bet) => ({
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
    </div>
  );
};

export default OnlineReport;
