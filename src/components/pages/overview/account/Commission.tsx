import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
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
import { useTotalSuperAgentCommissionQuery } from "@/store/services/user.service";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";

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

  // RTK Query hook for super agent commission (standard query)
  const {
    data: commissionData,
    isLoading,
    error,
    refetch,
  } = useTotalSuperAgentCommissionQuery(
    { user_id: user?.id!, from: startDate, to: endDate },
    {
      skip: !user?.id!, // Disable automatic fetching on mount
    }
  );

  React.useEffect(() => {
    if (commissionData && commissionData.success) {
      const g = commissionData.data.grandTotals;
      const s = commissionData.data.providerTotals.sports;
      const v = commissionData.data.providerTotals.virtual;
      setGrandTotals({
        type: "grand",
        settledBets: 0,
        noOfBets: 0,
        stake: g.stake,
        winnings: g.winnings,
        netRevenue: g.netRevenue,
        commissionRate: g.commissionRate,
        paidCommission: g.paidCommission,
        pendingCommission: g.pendingCommission,
        bonus: g.bonus,
        grossProfit: g.grossProfit,
      });
      setSportsTotals({
        type: "sports",
        settledBets: 0,
        noOfBets: 0,
        stake: s.stake,
        winnings: s.winnings,
        netRevenue: s.netRevenue,
        commissionRate: s.commissionRate,
        paidCommission: s.paidCommission,
        pendingCommission: s.pendingCommission,
        bonus: s.bonus,
        grossProfit: s.grossProfit,
      });
      setVirtualTotals({
        type: "virtual",
        settledBets: 0,
        noOfBets: 0,
        stake: v.stake,
        winnings: v.winnings,
        netRevenue: v.netRevenue,
        commissionRate: v.commissionRate,
        paidCommission: v.paidCommission,
        pendingCommission: v.pendingCommission,
        bonus: v.bonus,
        grossProfit: v.grossProfit,
      });
    }
  }, [commissionData, error]);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
  }) => {
    // Skeleton loader for each card
    const SkeletonCard = () => (
      <div
        className={`${pageClasses["info-card-bg"]} rounded-lg p-2 border ${pageClasses["info-card-border"]} animate-pulse`}
      >
        <div className={`h-3 w-1/3 ${classes["skeleton-bg"]} rounded mb-2`} />
        <div className={`h-5 w-2/3 ${classes["skeleton-bg"]} rounded`} />
      </div>
    );
    return (
      <div
        className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-lg border p-2`}
      >
        <div
          className={`flex items-center gap-2 mb-2 border-b ${classes["border"]} pb-2`}
        >
          <h3 className={`text-sm font-bold`}>{title}</h3>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div
              className={`${pageClasses["info-card-bg"]} rounded-lg p-3 border ${pageClasses["info-card-border"]}`}
            >
              <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
                Stake
              </div>
              <div
                className={`text-sm font-semibold ${pageClasses["info-value-text"]}`}
              >
                <CurrencyFormatter
                  amount={data.stake}
                  className={""}
                  spanClassName={""}
                />
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
                <CurrencyFormatter
                  amount={data.winnings}
                  className={""}
                  spanClassName={""}
                />
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
                <CurrencyFormatter
                  amount={data.grossProfit}
                  className={""}
                  spanClassName={""}
                />
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
                <CurrencyFormatter
                  amount={data.netRevenue}
                  className={""}
                  spanClassName={""}
                />
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
                <CurrencyFormatter
                  amount={data.paidCommission}
                  className={""}
                  spanClassName={""}
                />
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
                <CurrencyFormatter
                  amount={data.pendingCommission}
                  className={""}
                  spanClassName={""}
                />
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
                <CurrencyFormatter
                  amount={data.bonus}
                  className={""}
                  spanClassName={""}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`text-center py-8 ${classes["text-secondary"]} text-sm`}
          >
            No data available
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto pt-2 px-2 ${classes["text-primary"]}`}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 ${pageClasses["header-icon-bg"]} rounded-lg flex items-center justify-center`}
          >
            <BarChart3 size={20} className={classes["text-secondary"]} />
          </div>
          <div>
            <h1 className={`text-base font-bold`}>Commission Report</h1>
            <p className={`${classes["text-secondary"]} text-xs`}>
              View your commission breakdown
            </p>
          </div>
        </div>

        {/* Report Type Selector */}
        <div
          className={`${classes.sports_page["card-bg"]} backdrop-blur-sm  rounded-lg border ${classes.sports_page["card-border"]} p-2`}
        >
          <div className="grid gap-2 ">
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
            />
          </div>
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
