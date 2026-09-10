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
