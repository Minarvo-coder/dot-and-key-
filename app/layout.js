import "./globals.css";
import { AppProvider } from "@/components/AppContext";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "KAIROS | Dot & Key Skincare Market Intelligence",
  description:
    "Market intelligence that creates marketing. Grounded skincare intelligence turned into verifiable, high-converting creative assets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-app-bg text-ink-primary antialiased min-h-screen">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
