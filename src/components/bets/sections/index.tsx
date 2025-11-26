import { PreMatchFixture } from "@/store/features/types/fixtures.types";

export type OutcomeProps = {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  is_loading?: boolean;
};

export { default as OverUnder } from "./OverUnder";
export { default as MainCard } from "./MainCard";
export { default as HandicapMarket } from "./HandicapMarket";
export { default as MatchResultBothTeamsScore } from "./MatchResultBothTeamsScore";
export { default as CombinationMarket } from "./CombinationMarket";
export { default as ExactGoals } from "./ExactGoals";
export { default as DynamicMarketRenderer } from "./DynamicMarketRenderer";
