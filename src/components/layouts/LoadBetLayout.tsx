import React, { ReactNode } from "react";
import AppHeader from "./AppHeader";
import { useBetting } from "../../hooks/useBetting";

interface LoadBetsLayoutProps {
  children: ReactNode;
  title?: string;
  activeTab?: "sports" | "live" | "prematch";
  onTabPress?: (tab: "sports" | "live" | "prematch") => void;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  showBalance?: boolean;
  navigationBar: ReactNode;
}

export const LoadBetsLayout: React.FC<LoadBetsLayoutProps> = ({
  children,
  title,

  onMenuPress,
  onSearchPress,
  showBalance = true,
  navigationBar,
}) => {
  const {
    selected_bets,
    total_odds,
    potential_winnings,
    stake,
    updateStake,
    clearBets,
    removeBet,
  } = useBetting();
  return (
    <div className="flex-1 bg-primary min-h-screen">
      {/* Header Section */}
      <AppHeader
        title={title}
        onMenuPress={onMenuPress}
        onSearchPress={onSearchPress}
        showBalance={showBalance}
      />
      {navigationBar}
      <div className="flex-1 w-full bg-secondary h-full">
        <div className="h-[75vh] w-full">{children}</div>
      </div>
    </div>
  );
};

export default LoadBetsLayout;
