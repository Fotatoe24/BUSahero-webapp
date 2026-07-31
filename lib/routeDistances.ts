// lib/routeDistances.ts
//
// Single source of truth for town positions along the Olongapo -> Sta. Cruz
// coastal corridor. Each town's distanceKm is its distance FROM OLONGAPO
// along that corridor -- since all these towns sit on the same route, the
// distance between any two towns is just the difference between their two
// positions (see getDistanceBetween below).
//
// To add a new town, add a row with its distance from Olongapo. It will
// automatically show up in both the "From" and "To" dropdowns, and
// From/To distance math works for it immediately -- no other code changes.

export interface TownRoute {
  id: string; // stable slug, used as <option> key/value
  town: string;
  distanceKm: number; // distance from Olongapo along the corridor
}

export const TOWN_ROUTES: TownRoute[] = [
  { id: "olongapo", town: "Olongapo", distanceKm: 0 },
  { id: "subic", town: "Subic", distanceKm: 12.0 },
  { id: "castillejos", town: "Castillejos", distanceKm: 20.8 },
  { id: "san-marcelino", town: "San Marcelino", distanceKm: 27.5 },
  { id: "san-antonio", town: "San Antonio", distanceKm: 35.4 },
  { id: "san-narciso", town: "San Narciso", distanceKm: 42.7 },
  { id: "san-felipe", town: "San Felipe", distanceKm: 47.7 },
  { id: "cabangan", town: "Cabangan", distanceKm: 59.1 },
  { id: "botolan", town: "Botolan", distanceKm: 77.2 },
  { id: "iba", town: "Iba", distanceKm: 82.5 },
  { id: "sta-cruz", town: "Sta. Cruz", distanceKm: 141.0 },

  // Not yet measured -- fill in distanceKm when you have it, uncomment,
  // and it'll appear in both dropdowns automatically:
  // { id: "candelaria", town: "Candelaria", distanceKm: 0 },
  // { id: "masinloc", town: "Masinloc", distanceKm: 0 },
  // { id: "palauig", town: "Palauig", distanceKm: 0 },
];

export function findTownRoute(id: string): TownRoute | undefined {
  return TOWN_ROUTES.find((r) => r.id === id);
}

export function getRouteLabel(fromTown: string, toTown: string): string {
  return `${fromTown} → ${toTown}`;
}

// Distance between any two towns on the corridor = the absolute difference
// between their distances-from-Olongapo. Works for any pair, in either
// direction, including pairs that don't involve Olongapo at all.
export function getDistanceBetween(fromId: string, toId: string): number {
  const from = findTownRoute(fromId);
  const to = findTownRoute(toId);

  if (!from || !to) return 0;

  return Math.round(Math.abs(to.distanceKm - from.distanceKm) * 10) / 10;
}
