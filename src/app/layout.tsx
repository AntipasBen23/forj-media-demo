// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forj Founder Intake Engine (Demo)",
  description:
    "Tiny prototype that turns messy founder notes into structured LinkedIn content for Forj Media.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-forj-bg text-forj-text">
          <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 md:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
