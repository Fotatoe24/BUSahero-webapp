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

// If a bus hasn't pushed an update in this long, whatever speed/status it
// last reported is stale and shouldn't be trusted — the device may have
// lost power, signal, or connectivity. Without this, a bus that was moving
// right before it went dark would show "In Transit" forever, since the
// last cached speed value never changes again.
const NO_SIGNAL_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes

// Words in the device's own `status` that explicitly contradict "moving",
// used to cross-check against `speed` rather than trusting either signal
// alone.
const STOPPED_WORDS = ["stop", "idle", "park"];

/**
 * Canonicalizes the raw `status`/`speed`/`updatedAt` coming from the GPS
 * tracking device before it reaches any UI (Dashboard, Bus Information,
 * the map).
 *
 * The device writes directly to Firebase (see README's "Data model"
 * section) — this app doesn't control its exact wording or reporting
 * interval. Two things this guards against:
 *
 * 1. Stale data: if `updatedAt` is missing or older than
 *    NO_SIGNAL_THRESHOLD_MS, the bus is reported as "No Signal" instead
 *    of replaying whatever status/speed it last had — otherwise a bus
 *    that went offline mid-trip would look "In Transit" indefinitely.
 *
 * 2. Speed/status disagreement: `speed` is the primary signal for the
 *    moving/stopped distinction (it's a plain number, nothing to guess),
 *    but "In Transit" is only returned when the device's own `status`
 *    doesn't explicitly contradict it (e.g. `status: "Stopped"` while a
 *    stray GPS speed blip briefly reports > 0). Only when both signals
 *    agree — or `status` says nothing relevant either way — does a
 *    positive speed reading count as "In Transit".
 */
export function normalizeBusStatus(
  status: string | undefined | null,
  speed: number | undefined | null,
  updatedAt: number | undefined | null
): string {
  const age = updatedAt ? Date.now() - updatedAt : Infinity;

  if (!updatedAt || age > NO_SIGNAL_THRESHOLD_MS) {
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
