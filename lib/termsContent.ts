export interface TermsClause {
  title: string;
  body: string;
}

// Shared by the full Terms & Conditions page (app/terms/page.tsx)
// and the first-run consent modal (components/TermsGate.tsx)
// so the wording only lives in one place.

export const TERMS_CLAUSES: TermsClause[] = [
  {
    title: "Use of the App",
    body: "BUSahero provides real-time bus tracking, ETA, and fare computation. Use the App only for lawful, personal transportation purposes.",
  },

  {
    title: "ETA & GPS Accuracy",
    body: "Arrival times are estimates based on GPS and distance data. Actual times may vary due to traffic, weather, road conditions, or network issues. GPS updates may occasionally be delayed or inaccurate.",
  },

  {
    title: "Fare Computation",
    body: "Fares shown are estimates. Actual fares onboard may differ due to updated rates or trip data discrepancies.",
  },

  {
    title: "Limitation of Liability",
    body: 'We are not liable for delays, missed trips, or losses resulting from inaccurate GPS data, ETA/fare estimates, or service interruptions. The App is provided "as is," without warranties.',
  },

  {
    title: "User Responsibility",
    body: "Do not misuse, modify, or attempt unauthorized access to the App, or interfere with its operation.",
  },

  {
    title: "Privacy",
    body: "Your data is handled according to our Privacy Policy.",
  },

  {
    title: "Changes to Terms",
    body: "These Terms may be updated as the App improves. Continued use means you accept the revised Terms.",
  },

  {
    title: "Contact",
    body: "Questions? Email us at [Insert Contact Email].",
  },
];

export const TERMS_EFFECTIVE_DATE = "Effective Date: July 2026";
