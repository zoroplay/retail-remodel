import React, { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import { toast } from "sonner";
import {
  ChevronDown,
  Filter,
  Info,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import Input from "../../../inputs/Input";
import DateRangeInput from "@/components/inputs/DateRangeInput";
import Select from "@/components/inputs/Select";
import { getClientTheme } from "@/config/theme.config";
// import moment from "moment";

interface CommissionData {
  type: string;
  settledBets: number;
  noOfBets: number;
  stake: number;
  winnings: number;
  netRevenue: number;
  commissionRate: number;
  paidCommission: number;
  pendingCommission: number;
  bonus: number;
  grossProfit: number;
}

const Commission = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.user_management_page;
  const { user } = useAppSelector((state) => state.user);
  const [reportType, setReportType] = useState("Agent Paid Commission");
  const [period, setPeriod] = useState("Last Week");
  //   const [startDate, setStartDate] = useState(
  //     moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD")
  //   );
  //   const [endDate, setEndDate] = useState(
  //     moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD")
  //   );

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [grandTotals, setGrandTotals] = useState<CommissionData | null>(null);
  const [sportsTotals, setSportsTotals] = useState<CommissionData | null>(null);
  const [virtualTotals, setVirtualTotals] = useState<CommissionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const normalizeData = (data: any[]): CommissionData[] =>
    data.map((item) => ({
      type: item.type,
      settledBets: Number(item.settledBets || item.settled_bets || 0),
      noOfBets: Number(item.noOfBets || 0),
      stake: Number(item.totalStake || 0),
      winnings: Number(item.totalWinnings || item.winnings || 0),
      netRevenue: Number(item.netRevenue || 0),
      commissionRate: Number(item.commissionRate || 0),
      paidCommission: Number(item.paidCommission || 0),
      pendingCommission: Number(item.pendingCommission || 0),
      bonus: Number(item.bonus || 0),
      grossProfit: 0,
    }));

  const fetchResult = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await agentCommissionReport({ from: startDate, to: endDate });
      // const normalized = normalizeData(response.data);
      // const addGrossProfit = (item: CommissionData | undefined) => {
      //   if (!item) return null;
      //   return { ...item, grossProfit: item.stake - item.winnings };
      // };
      // const sports = normalized.find((item) => item.type === "sports");
      // const virtual = normalized.find((item) => item.type === "virtual");
      // const total = normalized.find((item) => item.type === "total");
      // setGrandTotals(addGrossProfit(total));
      // setSportsTotals(addGrossProfit(sports));
      // setVirtualTotals(addGrossProfit(virtual));
      // toast.success("Commission report loaded successfully");

      setGrandTotals(null);
      setSportsTotals(null);
      setVirtualTotals(null);
      setIsLoading(false);
      toast.info("Commission API not yet implemented");
    } catch (error) {
      setIsLoading(false);
      toast.error("Unable to fetch commission report");
    }
  };

  // Remove auto-fetch on mount - user must click "Apply Filter" button
  // useEffect(() => {
  //   fetchResult();
  // }, []);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);

    if (value === "Last Week") {
      //   setStartDate(
      //     moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD")
      //   );
      //   setEndDate(
      //     moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD")
      //   );
      const now = new Date();
      const firstDayOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay() - 6)
      );
      const lastDayOfWeek = new Date(now.setDate(firstDayOfWeek.getDate() + 6));
      setStartDate(firstDayOfWeek.toISOString().split("T")[0]);
      setEndDate(lastDayOfWeek.toISOString().split("T")[0]);
    } else if (value === "Last Month") {
      //   setStartDate(
      //     moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD")
      //   );
      //   setEndDate(
      //     moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD")
      //   );
      const now = new Date();
      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
      setEndDate(lastDayOfMonth.toISOString().split("T")[0]);
    }
  };

  const TotalsSection = ({
    title,
    data,
    icon: Icon,
    color,
  }: {
    title: string;
    data: CommissionData | null;
    icon: any;
    color: string;
  }) => (
    <div
      className={`${pageClasses["card-bg"]} backdrop-blur-sm rounded-lg border ${pageClasses["card-border"]} p-4`}
    >
      <div
        className={`flex items-center gap-3 mb-4 border-b ${pageClasses["section-header-border"]} pb-3`}
      >
        <div
          className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon size={20} className="text-white" />
        </div>
        <h3
          className={`text-sm font-bold ${pageClasses["section-header-text"]}`}
        >
          {title}
        </h3>
      </div>

      {data ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Stake
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["info-value-text"]}`}
            >
              {formatCurrency(data.stake)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Winnings
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["balance-text"]}`}
            >
              {formatCurrency(data.winnings)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Gross Profit
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["header-icon-text"]}`}
            >
              {formatCurrency(data.grossProfit)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Net Revenue
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["info-value-text"]}`}
            >
              {formatCurrency(data.netRevenue)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Commission Rate
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["info-value-text"]}`}
            >
              {data.commissionRate}%
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Paid Commission
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["badge-deposit-text"]}`}
            >
              {formatCurrency(data.paidCommission)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Pending Commission
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["badge-withdraw-text"]}`}
            >
              {formatCurrency(data.pendingCommission)}
            </div>
          </div>
          <div
            className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Bonus
            </div>
            <div
              className={`text-sm font-semibold ${pageClasses["info-value-text"]}`}
            >
              {formatCurrency(data.bonus)}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`text-center py-8 ${pageClasses["subtitle-text"]} text-sm`}
        >
          {isLoading ? "Loading..." : "No data available"}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto ${pageClasses["page-bg"]} ${pageClasses["page-text"]}`}
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 ${pageClasses["header-icon-bg"]} rounded-lg flex items-center justify-center`}
          >
            <BarChart3 size={24} className={pageClasses["header-icon-text"]} />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${pageClasses["header-text"]}`}>
              Commission Report
            </h1>
            <p className={`${pageClasses["subtitle-text"]} text-xs`}>
              View your commission breakdown
            </p>
          </div>
        </div>

        {/* Report Type Selector */}
        <div
          className={`${pageClasses["card-bg"]} backdrop-blur-sm ${pageClasses["row-text"]} rounded-lg border ${pageClasses["card-border"]} p-4 mb-4`}
        >
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <Select
                label="Report Type"
                value={[reportType]}
                options={[
                  {
                    id: "agent-paid-commission",
                    name: "Agent Paid Commission",
                  },
                  { id: "sports-commission", name: "Sports Commission" },
                  { id: "virtual-commission", name: "Virtual Commission" },
                ]}
                onChange={(e) => setReportType(e[0] as string)}
                placeholder={""}
                bg_color={pageClasses["input-bg"]}
                text_color={pageClasses["input-text"]}
                border_color={`border ${pageClasses["input-border"]}`}
                className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} transition-all disabled:opacity-50`}
              />
            </div>

            <div>
              <Select
                label="Period"
                value={[period]}
                options={[
                  { id: "last-week", name: "Last Week" },
                  { id: "last-month", name: "Last Month" },
                  { id: "custom", name: "Custom" },
                ]}
                onChange={(e) => setPeriod(e[0] as string)}
                placeholder={""}
                bg_color={pageClasses["input-bg"]}
                text_color={pageClasses["input-text"]}
                border_color={`border ${pageClasses["input-border"]}`}
                className={`w-full border ${pageClasses["input-border"]} rounded-lg px-3 py-2 ${pageClasses["input-text"]} transition-all disabled:opacity-50`}
              />
            </div>

            <div>
              <DateRangeInput
                value={{
                  startDate: startDate,
                  endDate: endDate,
                }}
                label="Date Range"
                onChange={(e) => {
                  setStartDate((prev) => e.startDate ?? prev);
                  setEndDate((prev) => e.endDate ?? prev);
                }}
                bg_color={pageClasses["input-bg"]}
                text_color={pageClasses["input-text"]}
                border_color={`border ${pageClasses["input-border"]}`}
              />
            </div>
          </div>

          <button
            onClick={fetchResult}
            disabled={isLoading}
            className={`mt-3 w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 ${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} ${pageClasses["button-primary-text"]} text-sm font-medium rounded-lg transition-all shadow-lg disabled:opacity-50`}
          >
            <Filter size={16} />
            {isLoading ? "Loading..." : "Apply Filter"}
          </button>
        </div>

        {/* Info Banner */}
        <div
          className={`${pageClasses["header-icon-bg"]} border ${pageClasses["info-card-border"]} rounded-lg p-3 mb-4 flex items-center gap-3`}
        >
          <Info
            size={16}
            className={`${pageClasses["header-icon-text"]} flex-shrink-0`}
          />
          <span className={`text-xs ${pageClasses["info-label-text"]}`}>
            This report shows data for settled bets only
          </span>
        </div>

        {/* Totals Sections */}
        <div className="space-y-4">
          <TotalsSection
            title="Grand Totals"
            data={grandTotals}
            icon={TrendingUp}
            color="bg-gradient-to-br from-purple-600 to-purple-700"
          />
          <TotalsSection
            title="Sports Totals"
            data={sportsTotals}
            icon={DollarSign}
            color="bg-gradient-to-br from-blue-600 to-blue-700"
          />
          <TotalsSection
            title="Virtual Totals"
            data={virtualTotals}
            icon={BarChart3}
            color="bg-gradient-to-br from-green-600 to-green-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Commission;
