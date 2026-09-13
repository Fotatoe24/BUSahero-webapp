/**
 * Single source of truth for the active/inactive bus concept.
 *
 * Bus status is a free-form string coming straight from the realtime feed
 * (see lib/useRealtimeBuses.ts). "Inactive" is a status value like any
 * other ("In Transit", "Stopped", "Delayed") rather than a second,
 * independent flag — this keeps the map, stat cards, and tables all
 * reading from the same field.
 */
export function isBusActive(status: string | undefined | null): boolean {
  return (status ?? "").trim().toLowerCase() !== "inactive";
}

const KNOWN_STATUSES: Record<string, string> = {
  "in transit": "In Transit",
  "intransit": "In Transit",
  "in-transit": "In Transit",
  "in_transit": "In Transit",
  "moving": "In Transit",
  "stopped": "Stopped",
  "stop": "Stopped",
  "idle": "Stopped",
  "delayed": "Delayed",
  "delay": "Delayed",
  "inactive": "Inactive",
  "offline": "Inactive",
};

/**
 * Canonicalizes the raw `status` string coming from the GPS tracking
 * device before it reaches any UI (Dashboard, Bus Information, the map).
 *
 * The device writes directly to Firebase (see README's "Data model"
 * section) — this app doesn't control its exact casing/spacing. Comparing
 * with strict `=== "In Transit"` is fragile: any variant the hardware
 * sends ("in_transit", "IN TRANSIT", etc.) would silently fail to match
 * and the indicator would look broken/missing even though real data is
 * arriving. This normalizes known variants case-insensitively.
 *
 * If `status` is absent entirely, falls back to the one realtime signal
 * that's always present in the schema — `speed` — rather than showing a
 * blank/broken indicator.
 */
export function normalizeBusStatus(
  status: string | undefined | null,
  speed: number | undefined | null
): string {
  const raw = (status ?? "").trim();

  if (raw) {
    return KNOWN_STATUSES[raw.toLowerCase()] ?? raw;
  }

  return (speed ?? 0) > 0 ? "In Transit" : "Stopped";
}
