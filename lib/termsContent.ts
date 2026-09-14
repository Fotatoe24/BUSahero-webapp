export interface TermsClause {
  title: string;
  body: string;
}

// Shared by the full Terms & Conditions page (app/terms/page.tsx)
// and the first-run consent modal (components/TermsGate.tsx)
// so the wording only lives in one place.

export const TERMS_CLAUSES: TermsClause[] = [
  {
    title: "Acceptance of Terms",
    body: "By accessing and using the BUSahero Operator and Management system, authorized personnel agree to comply with these Terms and Conditions and use the system responsibly.",
  },

  {
    title: "Authorized Access",
    body: "The Operator and Management system is intended only for authorized personnel. Users may access and use only the features and information permitted by their assigned role.",
  },

  {
    title: "Account & Password Security",
    body: "Operators and management are responsible for keeping their account credentials confidential. Sharing accounts or passwords with unauthorized individuals is not permitted.",
  },

  {
    title: "GPS Tracking & System Accuracy",
    body: "BUSahero provides real-time bus tracking using GPS and internet connectivity. Location information, arrival estimates, and other system data may occasionally be delayed or inaccurate due to technical, network, GPS, traffic, or environmental conditions.",
  },

  {
    title: "Data Privacy & Confidentiality",
    body: "Operators and management must protect confidential information accessed through BUSahero, including account information, driver details, operational data, and other information that should not be disclosed to unauthorized persons.",
  },

  {
    title: "Prohibited Activities",
    body: "Users must not misuse the system, access accounts without authorization, manipulate or falsify operational data, bypass security measures, or interfere with the normal operation of BUSahero.",
  },

  {
    title: "Management Responsibility & System Limitations",
    body: "BUSahero is intended to assist with bus monitoring and management. Operators and management remain responsible for actual transportation operations, including dispatching, scheduling, driver supervision, route decisions, and passenger safety. The system may also experience temporary interruptions due to technical or connectivity issues.",
  },
];

export const TERMS_EFFECTIVE_DATE = "Effective Date: September 2026";
