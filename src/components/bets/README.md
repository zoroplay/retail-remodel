# Combined Betting Component

This is a modernized TypeScript/React implementation of the legacy Combined betting component with full coupon calculation logic.

## Features

- **Modern TypeScript Implementation**: Complete rewrite of the legacy JavaScript component with proper typing
- **Coupon Calculation Engine**: Full implementation of the complex betting calculation logic including:
  - Combination calculations (Singles, Doubles, Trebles, n-folds)
  - Potential winnings calculations
  - Bonus calculations
  - Stake management
- **Redux Integration**: Works with Redux Toolkit for state management
- **Modern UI**: Clean, modern design using Tailwind CSS
- **Error Handling**: Robust error handling for calculation edge cases

## File Structure

```
src/
├── components/bets/
│   ├── Combined.tsx                 # Main component
│   └── CombinedExample.tsx         # Usage example
├── utils/
│   ├── CouponCalculation.ts        # Main calculation engine
│   ├── CalculatedGroup.ts          # Group calculation helper
│   ├── CalculatedCoupon.ts         # Coupon calculation helper
│   ├── Combination.ts              # Combination calculation utilities
│   ├── SlotKey.ts                  # Key generation utility
│   ├── arrayExtensions.ts          # Array utility functions
│   └── couponHelpers.ts            # Bonus and formatting helpers
├── store/features/
│   ├── types/coupon.types.ts       # TypeScript interfaces
│   └── actions/coupon.actions.ts   # Redux actions
```

## Usage

### Basic Usage

```tsx
import Combined from "./components/bets/Combined";
import type { SelectedBet } from "./store/features/types";

const MyComponent = () => {
  const selectedBets: SelectedBet[] = [
    // Your selected bets data
  ];

  const globalVar = {
    Currency: "NGN",
    min_bonus_odd: 1.5,
    wth_perc: 5,
  };

  const bonusList = [
    { ticket_length: 2, bonus: 5 },
    { ticket_length: 3, bonus: 10 },
    // More bonus configurations
  ];

  return (
    <Combined
      selected_bets={selectedBets}
      stake={100}
      total_odds={4.5}
      globalVar={globalVar}
      bonusList={bonusList}
    />
  );
};
```

### With Redux State

```tsx
import { useAppSelector } from "./hooks/useAppDispatch";

const MyComponent = () => {
  const { selected_bets, coupon_data, stake, total_odds } = useAppSelector(
    (state) => state.betting
  );
  const globalVar = useAppSelector((state) => state.global);
  const bonusList = useAppSelector((state) => state.bonuses);

  return (
    <Combined
      selected_bets={selected_bets}
      stake={stake}
      total_odds={total_odds}
      globalVar={globalVar}
      bonusList={bonusList}
      couponData={coupon_data}
    />
  );
};
```

## Component Props

| Prop            | Type            | Required | Description                                    |
| --------------- | --------------- | -------- | ---------------------------------------------- |
| `selected_bets` | `SelectedBet[]` | Yes      | Array of selected betting options              |
| `stake`         | `number`        | Yes      | Base stake amount                              |
| `total_odds`    | `number`        | Yes      | Total odds for all selections                  |
| `globalVar`     | `any`           | Yes      | Global variables including currency, tax rates |
| `bonusList`     | `any[]`         | Yes      | Bonus configuration array                      |
| `couponData`    | `object`        | No       | Optional existing coupon data                  |

## Key Features

### 1. Automatic Combination Generation

The component automatically generates all possible betting combinations based on selected bets:

- Singles (1 selection)
- Doubles (2 selections)
- Trebles (3 selections)
- n-folds (n selections)

### 2. Real-time Calculations

- Potential winnings are calculated in real-time as stakes are entered
- Bonus calculations based on odds and number of selections
- Total stake calculation across all combinations

### 3. Modern UI

- Clean, responsive design
- Proper form controls with validation
- Visual feedback for user interactions
- Consistent with modern betting interfaces

## Calculation Logic

The component uses a sophisticated calculation engine that handles:

1. **Combination Calculations**: Determines all possible betting combinations
2. **Odds Processing**: Handles banker selections and regular selections
3. **Stake Distribution**: Manages individual stakes per combination type
4. **Bonus Calculations**: Applies bonuses based on selection count and odds
5. **Tax Calculations**: Handles withholding tax and excise duty

## Integration Notes

### Redux Store Integration

The component integrates with Redux store expecting the following state structure:

```typescript
interface BettingState {
  selected_bets: SelectedBet[];
  total_odds: number;
  stake: number;
  coupon_data: CouponData;
  // ... other betting state
}
```

### Environment Variables

The calculation engine uses these configurable constants:

- `MAX_COMBINATIONS_BY_GROUPING`: Maximum combinations per grouping
- `MAX_COUPON_COMBINATIONS`: Maximum total combinations
- `MIN_BONUS_ODD`: Minimum odds for bonus eligibility
- `MIN_BET_STAKE`: Minimum betting stake

## Migration from Legacy

This component replaces the legacy Combined component with:

1. **Type Safety**: Full TypeScript support
2. **Modern React**: Uses hooks and functional components
3. **Improved Performance**: Optimized calculations and re-renders
4. **Better Error Handling**: Graceful error handling and validation
5. **Maintainable Code**: Clean, well-documented codebase

## Example Implementation

See `CombinedExample.tsx` for a complete working example with sample data.

## Dependencies

- React 18+
- Redux Toolkit
- TypeScript 4.5+
- Tailwind CSS (for styling)

## Contributing

When modifying the calculation logic, ensure:

1. All calculations maintain precision (use proper number formatting)
2. Error cases are handled gracefully
3. TypeScript types are kept up to date
4. Tests are updated accordingly
