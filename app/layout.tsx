import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./globals.additions.css";
import { AuthProvider } from "@/lib/useAuth";
import TermsGate from "@/components/TermsGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BusaHero",
  description: "Bus Fare Management System",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TermsGate>
          <AuthProvider>{children}</AuthProvider>
        </TermsGate>
      </body>
    </html>
  );
}
