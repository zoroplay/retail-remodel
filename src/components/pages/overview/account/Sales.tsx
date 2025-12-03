import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import { toast } from "sonner";
import {
  ChevronDown,
  Filter,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";
// import moment from "moment";
import DateRangeInput from "@/components/inputs/DateRangeInput";
import { getClientTheme } from "@/config/theme.config";
import {
  useSuperAgentCommissionQuery,
  useTotalSuperAgentCommissionQuery,
} from "@/store/services/user.service";
import PaginatedTable from "@/components/common/PaginatedTable";

interface SalesData {
  channel: string;
  totalStake: number;
  totalWinnings: number;
  totalTickets: number;
  totalCancelled: number;
  grossProfit: number;
  netRevenue: number;
}

const Sales = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.user_management_page;
  const { user } = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState<
    "all" | "sports" | "virtual" | "casino"
  >("all");
  const [period, setPeriod] = useState("today");
  const [product, setProduct] = useState("");
  //   const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  //   const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Super Agent Commission Query
  const {
    data: superAgentCommissionData,
    isLoading: isCommissionLoading,
    error: commissionError,
    refetch: refetchCommission,
  } = useSuperAgentCommissionQuery(
    user?.id
      ? {
          user_id: user.id,
          from: startDate,
          to: endDate,
          provider: product,
        }
      : { user_id: 0, from: startDate, to: endDate, provider: product }
  );

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);

    switch (value) {
      case "today":
        // setStartDate(moment().format("YYYY-MM-DD"));
        // setEndDate(moment().format("YYYY-MM-DD"));
        setStartDate(new Date().toISOString().split("T")[0]);
        setEndDate(new Date().toISOString().split("T")[0]);
        break;
      case "yesterday":
        // setStartDate(moment().subtract(1, "day").format("YYYY-MM-DD"));
        // setEndDate(moment().subtract(1, "day").format("YYYY-MM-DD"));
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setStartDate(yesterday.toISOString().split("T")[0]);
        setEndDate(yesterday.toISOString().split("T")[0]);
        break;
      case "custom":
        break;
    }
  };

  const fetchResult = () => {
    refetchCommission();
  };

  // Map agent breakdown to salesData
  React.useEffect(() => {
    if (superAgentCommissionData && superAgentCommissionData.success) {
      setSalesData(
        superAgentCommissionData.data.agentBreakdown.map((agent) => ({
          channel: `Agent ${agent.agentId}`,
          totalStake: agent.totalStake,
          totalWinnings: agent.totalWinnings,
          totalTickets: 0,
          totalCancelled: 0,
          grossProfit: agent.profit,
          netRevenue: agent.commissionEarned,
        }))
      );
    } else {
      setSalesData([]);
    }
  }, [superAgentCommissionData]);

  // Totals from API response
  const totals =
    superAgentCommissionData && superAgentCommissionData.success
      ? {
          totalStake: superAgentCommissionData.data.totalRevenue,
          totalWinnings: 0,
          totalTickets: 0,
          totalCancelled: 0,
          grossProfit: superAgentCommissionData.data.totalCommissionAmount,
          netRevenue: superAgentCommissionData.data.superAgentCommissionAmount,
        }
      : {
          totalStake: 0,
          totalWinnings: 0,
          totalTickets: 0,
          totalCancelled: 0,
          grossProfit: 0,
          netRevenue: 0,
        };

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto ${classes["text-primary"]}`}
    >
      <div className="max-w-7xl mx-auto p-2 pb-0 flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center ${pageClasses["header-icon-bg"]}`}
          >
            <ShoppingCart
              size={20}
              className={pageClasses["header-icon-text"]}
            />
          </div>
          <div>
            <h1 className={`text-base font-bold`}>Sales Report</h1>
            <p className={`text-xs ${classes["text-secondary"]}`}>
              View sales analysis by channel and product
            </p>
          </div>
        </div>

        {/* Tabs */}
        {user?.role === "Shop" && (
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-md border ${pageClasses["card-border"]} p-2`}
          >
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === "all"
                    ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                    : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                }`}
              >
                All Products Analysis
              </button>
              <button
                onClick={() => setActiveTab("sports")}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === "sports"
                    ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                    : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                }`}
              >
                Sports by Channel
              </button>
              <button
                onClick={() => setActiveTab("virtual")}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === "virtual"
                    ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                    : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                }`}
              >
                Virtual by Channel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div
          className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-md border ${pageClasses["card-border"]} p-2`}
        >
          <div className="grid md:grid-cols-2 gap-2">
            {/* Period Selection */}
            {/* <div>
              <label className={`text-xs font-semibold mb-2 block`}>
                Select Period
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePeriodChange("today")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    period === "today"
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => handlePeriodChange("yesterday")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    period === "yesterday"
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                  }`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => handlePeriodChange("custom")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    period === "custom"
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                  }`}
                >
                  Custom
                </button>
              </div>
            </div> */}

            {/* Product Selection */}
            {/* <div>
              <label
                className={`text-xs font-semibold mb-2 block ${pageClasses["info-label-text"]}`}
              >
                Select Product
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setProduct("")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    product === "all"
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setProduct("sports")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    product === "retail"
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                  }`}
                >
                  Sports
                </button>
                <button
                  onClick={() => setProduct("online")}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    product === "online"
                      ? `${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-text"]} ${pageClasses["button-primary-hover"]}`
                      : `${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-text"]} ${pageClasses["button-secondary-hover"]}`
                  }`}
                >
                  Online
                </button>
              </div>
            </div> */}
          </div>

          {/* Date Range */}
          <div className={`grid gap-2 ${pageClasses["input-text"]}`}>
            <DateRangeInput
              // type="date"
              value={{
                startDate: startDate,
                endDate: endDate,
              }}
              label="Date Range"
              onChange={(e) => {
                setStartDate((prev) => e.startDate ?? prev);
                setEndDate((prev) => e.endDate ?? prev);
                //   setDateRange({
                //       ...dateRange,
                //       startDate: e.startDate,
                //       endDate: e.endDate,
                //     })
              }}
              // bg_color="bg-gradient-to-r from-slate-800 to-slate-700"
              // text_color="text-gray-200"
              // border_color="border border-slate-600"
              // text_color={pageClasses["input-text"]}

              // height="h-[42px]"

              // className="bg-gray-700 text-white px-3 py-2 rounded-md"
            />
          </div>
          {/* 
          <div className="flex gap-3">
            <button
              onClick={fetchResult}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} ${pageClasses["button-primary-text"]} text-sm font-medium rounded-md transition-all shadow-lg disabled:opacity-50`}
            >
              <Filter size={16} />
              {isLoading ? "Loading..." : "Generate Report"}
            </button>
            <button
              className={`px-4 py-2 ${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} ${pageClasses["button-secondary-text"]} text-sm font-medium rounded-md transition-all`}
            >
              Cancel
            </button>
          </div> */}
        </div>

        {/* Super Agent Commission Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3  gap-2">
          <div
            className={`${pageClasses["info-card-bg"]} border ${pageClasses["info-card-border"]} rounded-md p-2`}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign
                size={16}
                className={pageClasses["header-icon-text"]}
              />
              <div className={`text-xs ${pageClasses["info-label-text"]}`}>
                Total Revenue
              </div>
            </div>
            <div
              className={`text-sm font-bold ${pageClasses["info-value-text"]}`}
            >
              {formatCurrency(totals.totalStake)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} border ${pageClasses["info-card-border"]} rounded-md p-2`}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3
                size={16}
                className={pageClasses["header-icon-text"]}
              />
              <div className={`text-xs ${pageClasses["info-label-text"]}`}>
                Total Commission
              </div>
            </div>
            <div
              className={`text-sm font-bold ${pageClasses["info-value-text"]}`}
            >
              {formatCurrency(totals.grossProfit)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} border ${pageClasses["info-card-border"]} rounded-md p-2`}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign
                size={16}
                className={pageClasses["header-icon-text"]}
              />
              <div className={`text-xs ${pageClasses["info-label-text"]}`}>
                Super Agent Commission
              </div>
            </div>
            <div
              className={`text-sm font-bold ${pageClasses["info-value-text"]}`}
            >
              {formatCurrency(totals.netRevenue)}
            </div>
          </div>
        </div>

        {/* Sales Table */}
        {/* Table */}
        <PaginatedTable
          columns={[
            {
              id: "channel",
              name: "Agent",
            },
            {
              id: "stake",
              name: "Total Stake",
            },
            {
              id: "winnings",
              name: "Total Winnings",
            },
            {
              id: "gross_profit",
              name: "Profit",
            },
            {
              id: "net_revenue",
              name: "Commission Earned",
            },
            {
              id: "tickets",
              name: "Tickets",
            },
            {
              id: "cancelled",
              name: "Cancelled",
            },
          ]}
          className="grid-cols-7"
          data={salesData.map((sale) => ({
            channel: sale?.channel,
            stake: sale?.totalStake,
            winnings: sale?.totalWinnings,
            gross_profit: sale?.grossProfit,
            net_revenue: sale?.netRevenue,
            tickets: sale?.totalTickets,
            cancelled: sale?.totalCancelled,
          }))}
          isLoading={isCommissionLoading}
        />
      </div>
    </div>
  );
};

export default Sales;
