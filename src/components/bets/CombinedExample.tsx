import React from "react";
import Combined from "./Combined";
import type { SelectedBet } from "../../store/features/types";

// Example usage of the Combined component
const CombinedExample: React.FC = () => {
  // Sample data - replace with actual data from your Redux store
  const selectedBets: SelectedBet[] = [
    {
      match_id: 1001,
      game_id: 2001,
      game: {
        matchID: 1001,
        event_type: "pre" as const,
        gameID: 2001,
        match_id: 1001,
        game_id: 2001,
        name: "Team A vs Team B",
        eventTime: "2024-01-01T15:00:00Z",
        tournament: "Premier League",
        categoryName: "Football",
        sportName: "Football",
        sportID: 1,
        away_team: "Team B",
        category: "Football",
        combinability: 1,
        display_name: "Team A Win",
        element_id: "elem_1001_1",
        event_date: "2024-01-01",
        event_name: "Team A vs Team B",
        fixed: false,
        home_team: "Team A",
        market_id: 1,
        market_name: "1X2",
        odds: "2.50",
        outcome_id: "1",
        outcome_name: "1",
        event_id: "1001",
        producer_id: 1,
        selection_id: "1001_1_1",
        specifier: "",
        sport: "Football",
        sport_id: "1",
        stake: 100,
        type: "single",
      },
      odds_type: "1",
      market_name: "1X2",
      odds_value: 2.5,
    },
    {
      match_id: 1002,
      game_id: 2002,
      game: {
        matchID: 1002,
        event_type: "pre" as const,
        gameID: 2002,
        match_id: 1002,
        game_id: 2002,
        name: "Team C vs Team D",
        eventTime: "2024-01-01T17:00:00Z",
        tournament: "Premier League",
        categoryName: "Football",
        sportName: "Football",
        sportID: 1,
        away_team: "Team D",
        category: "Football",
        combinability: 1,
        display_name: "Team C Win",
        element_id: "elem_1002_1",
        event_date: "2024-01-01",
        event_name: "Team C vs Team D",
        fixed: false,
        home_team: "Team C",
        market_id: 1,
        market_name: "1X2",
        odds: "1.80",
        outcome_id: "1",
        outcome_name: "1",
        event_id: "1002",
        producer_id: 1,
        selection_id: "1002_1_1",
        specifier: "",
        sport: "Football",
        sport_id: "1",
        stake: 100,
        type: "single",
      },
      odds_type: "1",
      market_name: "1X2",
      odds_value: 1.8,
    },
  ];

  const globalVar = {
    Currency: "NGN",
    min_bonus_odd: 1.5,
    wth_perc: 5,
  };

  const bonusList = [
    { ticket_length: 2, bonus: 5 },
    { ticket_length: 3, bonus: 10 },
    { ticket_length: 4, bonus: 15 },
    { ticket_length: 5, bonus: 20 },
  ];

  const couponData = {
    stake: 100,
    totalStake: 200,
    minBonus: 50,
    maxBonus: 150,
    minWin: 250,
    maxWin: 450,
    currency: "NGN",
    combos: [],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">
        Combined Betting Component
      </h1>
      <Combined
        selected_bets={selectedBets}
        stake={100}
        total_odds={4.5} // 2.50 * 1.80
        globalVar={globalVar}
        bonusList={bonusList}
        couponData={couponData}
      />
    </div>
  );
};

export default CombinedExample;
