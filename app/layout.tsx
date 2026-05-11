import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dostt Expert Dashboard",
  description: "Check your availability and performance as a Dostt expert",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
