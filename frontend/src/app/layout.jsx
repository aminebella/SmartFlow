// ← root layout (fonts, providers)
import { Geist, Geist_Mono, DM_Sans  } from "next/font/google";
import { Suspense } from "react";

import Loading from "./loading";

import "@/styles/globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "SmartFlow — AI-Powered Project Management",
  description: "SmartFlow — AI-Powered Project Management is an innovative project management tool that leverages artificial intelligence to streamline workflows, enhance collaboration, and boost productivity. With SmartFlow, teams can automate routine tasks, gain insights from data, and make informed decisions to drive project success.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}