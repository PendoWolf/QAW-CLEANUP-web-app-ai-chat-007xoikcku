// Pendo Track Events. The Pendo agent attaches the visitor, account, time and URL to
// every event, so the properties only carry what the event itself knows.
type TrackProperties = Record<string, string | number | boolean | null | undefined>;

interface PendoAgent {
  track: (event: string, properties?: TrackProperties) => void;
}

declare global {
  interface Window {
    pendo?: PendoAgent;
  }
}

/** Sends a Pendo Track Event. It does nothing when the Pendo agent isn't loaded, and never throws. */
export function trackEvent(event: string, properties: TrackProperties = {}): void {
  try {
    window.pendo?.track(event, properties);
  } catch {
    // A tracking failure must never break the app.
  }
}

/** Keeps a free-text value short, so the event stays within Pendo's property size limit. */
export function truncate(value: string, maxLength = 100): string {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Days since the epoch for a `YYYY-MM-DD` date, counted in UTC so daylight saving can't shift it. */
function toEpochDay(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / DAY_MS);
}

function todayEpochDay(): number {
  const now = new Date();
  return Math.round(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS);
}

/** The number of days a trip covers, counting both the start and the end date. */
export function tripLengthDays(startDate: string, endDate: string): number {
  return toEpochDay(endDate) - toEpochDay(startDate) + 1;
}

/** Days from today until a trip starts. It's negative for a trip that already started. */
export function daysUntilStart(startDate: string): number {
  return toEpochDay(startDate) - todayEpochDay();
}
