import type { ComponentType } from "react";
import {
  IconSmartphone,
  IconClock,
  IconLocate,
  IconAlertTriangle,
  IconCheckShield,
  IconRefresh,
} from "@/components/Icons";

export interface TermsClause {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}

// Shared by the full Terms & Conditions page (app/terms/page.tsx) and the
// first-run consent modal (components/TermsGate.tsx) so the wording only
// lives in one place.
export const TERMS_CLAUSES: TermsClause[] = [
  {
    icon: IconSmartphone,
    title: "Use of the Application",
    body: "BUSahero is intended to provide commuters with real-time bus tracking, estimated arrival times, seat availability, and fare computation. Users agree to use the application only for lawful and personal transportation purposes.",
  },
  {
    icon: IconClock,
    title: "Arrival Time Estimates",
    body: "Estimated arrival times (ETA) are calculated using GPS location and distance data. Actual arrival times may vary due to traffic conditions, road closures, weather, driver decisions, or network interruptions.",
  },
  {
    icon: IconLocate,
    title: "GPS Accuracy",
    body: "Bus location updates depend on GPS signals and internet connectivity. Temporary inaccuracies or delays in location updates may occur.",
  },
  {
    icon: IconAlertTriangle,
    title: "Limitation of Liability",
    body: "The developers are not responsible for any inconvenience, delays, missed trips, or losses resulting from inaccurate GPS data, ETA estimates, or temporary service interruptions.",
  },
  {
    icon: IconCheckShield,
    title: "User Responsibility",
    body: "Users are responsible for using the application appropriately and should not misuse, modify, attempt unauthorized access, or interfere with the application's operation.",
  },
  {
    icon: IconRefresh,
    title: "Changes to the Terms",
    body: "These Terms and Conditions may be updated as the application is improved. Continued use of BUSahero after updates indicates acceptance of the revised terms.",
  },
];

export const TERMS_EFFECTIVE_DATE = "Effective Date: July 2026";
