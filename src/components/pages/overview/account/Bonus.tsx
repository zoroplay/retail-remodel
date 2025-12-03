import React, { useState } from "react";
import { useAppSelector } from "../../../../hooks/useAppDispatch";
import {
  Gift,
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  Award,
} from "lucide-react";
import { getClientTheme } from "@/config/theme.config";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";

interface BonusType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  stats: {
    label: string;
    value: string;
  }[];
}

const Bonus = () => {
  const { classes } = getClientTheme();
  const pageClasses = classes.user_management_page;
  const { user } = useAppSelector((state) => state.user);
  const [selectedBonus, setSelectedBonus] = useState<string | null>(null);

  // TODO: Replace with actual API data
  const bonusTypes: BonusType[] = [];

  const BonusCard = ({ bonus }: { bonus: BonusType }) => {
    const Icon = bonus.icon;
    const isSelected = selectedBonus === bonus.id;

    return (
      <div
        onClick={() => setSelectedBonus(bonus.id)}
        className={`${pageClasses["card-bg"]} border ${
          pageClasses["card-border"]
        } rounded-lg p-2 flex flex-col gap-2 cursor-pointer transition-all hover:scale-[1.02] ${
          isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/25" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 ${pageClasses["header-icon-bg"]} rounded-lg flex items-center justify-center`}
          >
            <Icon size={20} className={pageClasses["header-icon-text"]} />
          </div>
          <div className="flex-1">
            <h3
              className={`text-sm font-bold ${pageClasses["section-header-text"]}`}
            >
              {bonus.title}
            </h3>
            <p className={`text-[11px] ${pageClasses["subtitle-text"]}`}>
              {bonus.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {bonus.stats.map((stat, index) => (
            <div
              key={index}
              className={`${pageClasses["info-card-bg"]} rounded-lg p-2 border ${pageClasses["info-card-border"]}`}
            >
              <div className={`text-xs ${pageClasses["info-label-text"]}`}>
                {stat.label}
              </div>
              <div
                className={`text-sm font-semibold ${pageClasses["info-value-text"]}`}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const totalBonuses =
    bonusTypes.length > 0
      ? bonusTypes.reduce((acc, bonus) => {
          const value = parseFloat(bonus.stats[0].value.replace(/[₦,]/g, ""));
          return acc + value;
        }, 0)
      : 0;

  return (
    <div
      className={`h-[calc(100vh-110px)] overflow-y-auto ${classes["text-primary"]}`}
    >
      <div className="flex flex-col gap-2 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${pageClasses["header-icon-bg"]} rounded-lg flex items-center justify-center`}
            >
              <Gift size={20} className={pageClasses["header-icon-text"]} />
            </div>
            <div>
              <h1 className={`text-base font-bold `}>Bonus Management</h1>
              <p className={`${classes["text-secondary"]} text-xs`}>
                View and manage bonus programs
              </p>
            </div>
          </div>

          {/* Total Summary */}
          <div
            className={`${pageClasses["info-card-bg"]} border ${pageClasses["info-card-border"]} rounded-lg px-4 py-2`}
          >
            <div className={`text-xs ${pageClasses["info-label-text"]} mb-1`}>
              Total Bonuses Awarded
            </div>
            <div
              className={`text-lg font-bold ${pageClasses["header-icon-text"]}`}
            >
              <CurrencyFormatter
                amount={totalBonuses}
                className={""}
                spanClassName={""}
              />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className={`${pageClasses["header-icon-bg"]} border ${pageClasses["info-card-border"]} rounded-md p-2 py-1 flex items-center gap-2`}
        >
          <Gift
            size={14}
            className={`${pageClasses["header-icon-text"]} flex-shrink-0`}
          />
          <span className={`text-[11px] ${pageClasses["info-label-text"]}`}>
            Click on any bonus card to view detailed information and manage
            settings
          </span>
        </div>

        {/* Bonus Cards Grid */}
        {bonusTypes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {bonusTypes.map((bonus) => (
              <BonusCard key={bonus.id} bonus={bonus} />
            ))}
          </div>
        ) : (
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-lg border ${classes.sports_page["card-border"]} p-8 text-center`}
          >
            <div className={`text-sm ${classes["text-secondary"]}`}>
              No bonus data available
            </div>
          </div>
        )}

        {/* Selected Bonus Details */}
        {selectedBonus && (
          <div
            className={`${classes.sports_page["card-bg"]} ${classes.sports_page["card-border"]} backdrop-blur-sm rounded-lg border p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm font-bold ${pageClasses["section-header-text"]}`}
              >
                Bonus Details
              </h3>
              <button
                onClick={() => setSelectedBonus(null)}
                className={`text-xs ${pageClasses["subtitle-text"]} hover:${pageClasses["row-text"]} transition-colors`}
              >
                Close
              </button>
            </div>

            <div
              className={`${pageClasses["info-card-bg"]} rounded-lg p-4 border ${pageClasses["info-card-border"]}`}
            >
              <div className={`text-sm ${pageClasses["info-label-text"]} mb-4`}>
                Detailed information and settings for{" "}
                <span
                  className={`font-semibold ${pageClasses["info-value-text"]}`}
                >
                  {bonusTypes.find((b) => b.id === selectedBonus)?.title}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label
                    className={`text-xs font-semibold ${pageClasses["info-label-text"]} mb-1.5 block`}
                  >
                    Status
                  </label>
                  <select
                    className={`w-full h-[32px] ${pageClasses["input-bg"]} border ${pageClasses["input-border"]} rounded-lg px-3 text-sm ${pageClasses["input-text"]} focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`text-xs font-semibold ${pageClasses["info-label-text"]} mb-1.5 block`}
                  >
                    Bonus Percentage
                  </label>
                  <input
                    type="number"
                    placeholder="Enter percentage"
                    className={`w-full h-[32px] ${pageClasses["input-bg"]} border ${pageClasses["input-border"]} rounded-lg px-3 text-sm ${pageClasses["input-text"]} focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all`}
                  />
                </div>

                <div>
                  <label
                    className={`text-xs font-semibold ${pageClasses["info-label-text"]} mb-1.5 block`}
                  >
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter max amount"
                    className={`w-full h-[32px] ${pageClasses["input-bg"]} border ${pageClasses["input-border"]} rounded-lg px-3 text-sm ${pageClasses["input-text"]} focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all`}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className={`flex-1 px-4 py-2 ${pageClasses["button-primary-bg"]} ${pageClasses["button-primary-hover"]} ${pageClasses["button-primary-text"]} text-sm font-medium rounded-lg transition-all shadow-lg`}
                >
                  Save Changes
                </button>
                <button
                  className={`px-4 py-2 ${pageClasses["button-secondary-bg"]} ${pageClasses["button-secondary-hover"]} ${pageClasses["button-secondary-text"]} text-sm font-medium rounded-lg transition-all`}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Bonus Activity - Hidden until API is implemented */}
      </div>
    </div>
  );
};

export default Bonus;
