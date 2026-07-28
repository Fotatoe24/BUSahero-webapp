export interface Fare {
  id: string;
  route: string;

  // Distance in kilometers for this route. Regular and discounted fares are
  // always derived from this via lib/fareCalculator.ts (LTFRB fare guide),
  // so they never drift from the official schedule.
  distanceKm: number;

  updatedAt: number;
}
