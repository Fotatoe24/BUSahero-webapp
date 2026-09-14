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

// Hardware connectivity thresholds, based on the age of the device's own
// `updatedAt` timestamp (already sent by the existing GPS hardware — this
// file does not talk to the hardware or change how/when it reports).
//
//   age < FRESH_THRESHOLD_MS        -> trust the reported speed/status as
//                                      current; compute the normal
//                                      Active/In Transit/Stopped/Delayed
//                                      status as before.
//   FRESH_THRESHOLD_MS <= age < OFFLINE_THRESHOLD_MS
//                                    -> "No Signal": the device has gone
//                                      quiet for a little while, but not
//                                      long enough to call it offline.
//   age >= OFFLINE_THRESHOLD_MS      -> "Offline": device hasn't reported
//                                      in 5+ minutes.
//
// FRESH_THRESHOLD_MS is a judgment call — the hardware's exact reporting
// interval isn't known from the web app side (and per instructions, the
// hardware/firmware isn't something this file inspects or changes). 20s
// is generous enough that any device reporting at least every few seconds
// to ~15s (typical for a live GPS tracker) never flickers into "No
// Signal" during normal operation, while still catching a real gap early.
// Raise or lower it if it doesn't match your actual device's cadence.
const FRESH_THRESHOLD_MS = 20 * 1000; // 20 seconds
const OFFLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes — >= this is OFFLINE

// Words in the device's own `status` that explicitly contradict "moving",
// used to cross-check against `speed` rather than trusting either signal
// alone.
const STOPPED_WORDS = ["stop", "idle", "park"];

/**
 * Canonicalizes the raw `status`/`speed`/`updatedAt` coming from the GPS
 * tracking device before it reaches any UI (Dashboard, Bus Information,
 * the map). Called every time new Firebase data arrives AND on a
 * recurring frontend timer (see lib/useRealtimeBuses.ts) so connectivity
 * status keeps advancing even when the hardware has stopped sending
 * anything new — no manual refresh needed.
 *
 * Three things this guards against:
 *
 * 1. A missing/invalid timestamp never crashes and is never treated as a
 *    live connection — it's reported as "Offline" (no confirmed contact),
 *    same as data that's aged past the offline threshold.
 *
 * 2. Stale data: once `updatedAt` is older than FRESH_THRESHOLD_MS, the
 *    bus is reported as "No Signal" (< 5 min) or "Offline" (>= 5 min)
 *    instead of replaying whatever speed/status it last had — otherwise a
 *    bus that went offline mid-trip would look "In Transit" forever.
 *
 * 3. Speed/status disagreement: for data fresh enough to trust, `speed`
 *    is the primary signal for the moving/stopped distinction (it's a
 *    plain number, nothing to guess), but "In Transit" is only returned
 *    when the device's own `status` doesn't explicitly contradict it
 *    (e.g. `status: "Stopped"` while a stray GPS speed blip briefly
 *    reports > 0).
 */
export function normalizeBusStatus(
  status: string | undefined | null,
  speed: number | undefined | null,
  updatedAt: number | undefined | null
): string {
  const hasValidTimestamp =
    typeof updatedAt === "number" && Number.isFinite(updatedAt) && updatedAt > 0;

  const age = hasValidTimestamp ? Date.now() - updatedAt! : Infinity;

  if (!hasValidTimestamp || age >= OFFLINE_THRESHOLD_MS) {
    return "Offline";
  }

  if (age >= FRESH_THRESHOLD_MS) {
    return "No Signal";
  }

  const lower = String(status ?? "").trim().toLowerCase();

  if (lower.includes("inactive") || lower.includes("offline")) {
    return "Inactive";
  }

  if (lower.includes("delay")) {
    return "Delayed";
  }

  const speedSaysMoving = (Number(speed) || 0) > 0;
  const statusSaysStopped = STOPPED_WORDS.some((word) => lower.includes(word));

  return speedSaysMoving && !statusSaysStopped ? "In Transit" : "Stopped";
}
