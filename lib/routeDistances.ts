// lib/routeDistances.ts
//
// Single source of truth for Olongapo -> town distances.
// To add a new town, just add a row here -- FareCalculator.tsx and any
// other consumer of TOWN_ROUTES will pick it up automatically.

export interface TownRoute {
  id: string; // stable slug, used as <option> key/value
  town: string;
  distanceKm: number;
}

export const ORIGIN_TERMINAL = "Olongapo";

export const TOWN_ROUTES: TownRoute[] = [
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
  // and it'll appear in the calculator dropdown automatically:
  // { id: "candelaria", town: "Candelaria", distanceKm: 0 },
  // { id: "masinloc", town: "Masinloc", distanceKm: 0 },
  // { id: "palauig", town: "Palauig", distanceKm: 0 },
];

export function getRouteLabel(town: string): string {
  return `${ORIGIN_TERMINAL} → ${town}`;
}

export function findTownRoute(id: string): TownRoute | undefined {
  return TOWN_ROUTES.find((r) => r.id === id);
}
