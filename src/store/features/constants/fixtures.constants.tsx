import { FixturesState } from "../types/fixtures.types";

export const initialFixturesState: FixturesState = {
  fixtures: [],
  selectedMarket: [],
  markets: [],
  outcomeTypes: [],
  selectedGame: null,
  couponData: null,
  cashdesk_fixtures: {
    sport_id: 0,
    fixtures: [],
    selectedMarket: [],
    is_loading: false,
  },
};
