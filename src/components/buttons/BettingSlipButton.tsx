import React from "react";

// Placeholder hooks and constants
const useBetting = () => ({
  selected_bets: [],
  total_odds: 0,
  potential_winnings: 0,
});

const useFullscreenModal = () => ({
  openFullscreenModal: (config: any) =>
    console.log("Open betting slip modal", config),
});

const MODAL_COMPONENTS = {
  BettingSlip: "BettingSlip",
};

interface BettingSlipButtonProps {
  className?: string;
}

const BettingSlipButton: React.FC<BettingSlipButtonProps> = ({ className }) => {
  const { selected_bets, total_odds, potential_winnings } = useBetting();
  const { openFullscreenModal } = useFullscreenModal();

  const handleOpenBettingSlip = () => {
    openFullscreenModal({
      component_name: MODAL_COMPONENTS.BettingSlip,
      title: "Betting Slip",
      dismissible: true,
    });
  };

  return (
    <button
      className={`${
        selected_bets.length > 0 ? "bg-green-500" : "bg-gray-500"
      } rounded-lg p-3 flex items-center justify-between shadow-lg w-full hover:opacity-90 transition-opacity ${className}`}
      onClick={handleOpenBettingSlip}
    >
      <div className="flex items-center gap-2">
        <span className="text-white text-lg">🎫</span>
        <span className="text-white font-bold text-sm">
          {selected_bets.length > 0
            ? `${selected_bets.length} Selection${
                selected_bets.length !== 1 ? "s" : ""
              }`
            : "No Selections"}
        </span>
      </div>

      {selected_bets.length > 0 ? (
        <div className="flex items-center gap-2">
          <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
            <span className="text-white font-semibold text-xs">
              {total_odds.toFixed(2)}
            </span>
          </div>
          <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
            <span className="text-white font-semibold text-xs">
              {potential_winnings.toFixed(2)}
            </span>
          </div>
          <span className="text-white text-sm">→</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-white opacity-70 text-xs">Tap to view</span>
          <span className="text-white text-sm">→</span>
        </div>
      )}
    </button>
  );
};

export default BettingSlipButton;
