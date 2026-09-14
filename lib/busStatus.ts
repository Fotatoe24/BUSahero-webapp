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

/**
 * Canonicalizes the raw `status`/`speed` coming from the GPS tracking
 * device before it reaches any UI (Dashboard, Bus Information, the map).
 *
 * The device writes directly to Firebase (see README's "Data model"
 * section) — this app doesn't control its exact wording. An earlier
 * version of this function tried to whitelist known spellings of
 * "moving" ("in transit", "in_transit", "moving", ...) and only fell
 * back to `speed` when `status` was completely empty. That's exactly
 * backwards for a real device: if it sends *any* word this whitelist
 * doesn't happen to include (e.g. "Running", "En Route", "Active"),
 * the raw word would be passed through unrecognized and would never
 * strictly equal "In Transit" downstream — so a genuinely moving bus
 * would be counted as 0 "In transit" even with real data arriving.
 *
 * `speed` is a plain number with no wording to guess, so it's the
 * authoritative signal for the moving/stopped distinction. `status` is
 * only consulted for the two states that can't be inferred from speed
 * at all — Delayed and Inactive — using loose substring matching so it
 * doesn't matter whether the device sends "Delayed", "delay", or
 * "DELAYED — traffic".
 */
export function normalizeBusStatus(
  status: string | undefined | null,
  speed: number | undefined | null
): string {
  const lower = String(status ?? "").trim().toLowerCase();

  if (lower.includes("inactive") || lower.includes("offline")) {
    return "Inactive";
  }

  if (lower.includes("delay")) {
    return "Delayed";
  }

  return (Number(speed) || 0) > 0 ? "In Transit" : "Stopped";
}
