/**
 * Fare calculation based on the LTFRB PUB (Ordinary) General Fare Guide,
 * Provincial, effective March 14, 2026 (Provisional Fare Increase of
 * Php1.00 on the base fare and Php0.30 on the succeeding kilometer,
 * per Order dated March 13, 2026).
 *
 * Regular fare:    P12.00 for the first 5 km, +P2.20 per additional km.
 * Discounted fare: Student / Elderly / PWD, 20% off the regular fare,
 *                   rounded to the nearest P0.25 (matches the printed
 *                   fare matrix, e.g. 10 km -> P23.00 regular / P18.50
 *                   discounted).
 *
 * The printed fare guide only lists 5 km increments; these functions
 * apply the same formula continuously so any distance can be priced,
 * not just multiples of 5.
 */

export const BASE_FARE = 12.0;
export const BASE_DISTANCE_KM = 5;
export const RATE_PER_KM = 2.2;
export const DISCOUNT_RATE = 0.2;

function roundToQuarter(value: number): number {
  return Math.round(value / 0.25) * 0.25;
}

export function getRegularFare(distanceKm: number): number {
  if (!distanceKm || distanceKm <= 0) return 0;

  if (distanceKm <= BASE_DISTANCE_KM) return BASE_FARE;

  const extraKm = distanceKm - BASE_DISTANCE_KM;

  return BASE_FARE + extraKm * RATE_PER_KM;
}

export function getDiscountedFare(distanceKm: number): number {
  const regular = getRegularFare(distanceKm);

  return roundToQuarter(regular * (1 - DISCOUNT_RATE));
}

export interface FareBreakdown {
  distanceKm: number;
  regular: number;
  discounted: number;
}

export function getFareBreakdown(distanceKm: number): FareBreakdown {
  return {
    distanceKm,
    regular: getRegularFare(distanceKm),
    discounted: getDiscountedFare(distanceKm),
  };
}

export function formatPeso(amount: number): string {
  return `\u20b1${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
