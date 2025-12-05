import React, { useEffect, useState } from "react";
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
import DateRangeInput from "@/components/inputs/DateRangeInput";
import { getClientTheme } from "@/config/theme.config";
import { AppHelper } from "@/lib/helper";
import { useSuperAgentCommissionQuery } from "@/store/services/user.service";
import PaginatedTable from "@/components/common/PaginatedTable";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import SwitchInput from "@/components/inputs/SwitchInput";

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
  const [product, setProduct] = useState("");
  const [period, setPeriod] = useState<"today" | "yesterday" | "manual">(
    "today"
  );
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const format = (d: Date) => d.toISOString().slice(0, 10);
    return {
      startDate: format(start),
      endDate: format(end),
    };
  });
  // Update dateRange when period changes
  useEffect(() => {
    const now = new Date();
    const format = (d: Date) => d.toISOString().slice(0, 10);
    if (period === "today") {
      setDateRange({
        startDate: format(now),
        endDate: format(now),
      });
    } else if (period === "yesterday") {
      const yest = new Date(now);
      yest.setDate(now.getDate() - 1);
      setDateRange({
        startDate: format(yest),
        endDate: format(yest),
      });
    }
    // If manual, do not change dateRange
  }, [period]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  // Super Agent Commission Query
  const {
    data: superAgentCommissionData,
    isFetching: isCommissionLoading,
    error: commissionError,
    refetch: refetchCommission,
  } = useSuperAgentCommissionQuery(
    user?.id
      ? {
          user_id: user.id,
          from: dateRange.startDate,
          to: dateRange.endDate,
          provider: product,
        }
      : {
          user_id: 0,
          from: dateRange.startDate,
          to: dateRange.endDate,
          provider: product,
        }
  );

  // Remove handlePeriodChange, not needed with date range

  useEffect(() => {
    refetchCommission();
  }, [dateRange.startDate, dateRange.endDate, product, activeTab]);

  // Map agent breakdown to salesData
  useEffect(() => {
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
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <label className="text-xs font-semibold">Period:</label>
              <div className="min-w-[220px]">
                <SwitchInput
                  options={[
                    { title: "Today" },
                    { title: "Yesterday" },
                    { title: "Manual" },
                  ]}
                  selected={
                    period === "today" ? 0 : period === "yesterday" ? 1 : 2
                  }
                  onChange={(i) =>
                    setPeriod(
                      i === 0 ? "today" : i === 1 ? "yesterday" : "manual"
                    )
                  }
                  rounded="rounded-md"
                  background={`${classes.betslip["tab-bg"]} ${classes.betslip["tab-border"]} !p-[2px] border shadow-sm`}
                  thumb_background={`${classes.betslip["tab-bg"]}`}
                  thumb_color={`${classes.betslip["tab-active-bg"]} ${classes.betslip["tab-active-text"]} transition-all duration-300 !rounded-[4px]`}
                  text_color={`${classes.betslip["tab-inactive-text"]} !text-[11px] font-medium`}
                  selected_text_color={`${classes.betslip["tab-active-text"]} !text-[11px] font-medium`}
                />
              </div>
            </div>
            {period === "manual" && (
              <div className="min-w-[250px]">
                <DateRangeInput
                  value={{
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                  }}
                  // label="Date Range"
                  onChange={(e) =>
                    setDateRange({
                      ...dateRange,
                      startDate: e.startDate,
                      endDate: e.endDate,
                    })
                  }
                />
              </div>
            )}
            {/* Product filter UI can be added here if needed */}
          </div>
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
              <CurrencyFormatter
                amount={totals.totalStake}
                className={""}
                spanClassName={""}
              />
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
              <CurrencyFormatter
                amount={totals.grossProfit}
                className={""}
                spanClassName={""}
              />
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
              <CurrencyFormatter
                amount={totals.netRevenue}
                className={""}
                spanClassName={""}
              />
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
