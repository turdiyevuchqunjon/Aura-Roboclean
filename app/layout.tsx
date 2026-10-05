import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-body", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "AURA RoboClean Pro — suv filtrli changyutgich | Rasmiy diler",
  description:
    "Changni suvda ushlaydigan, havoni ham tozalaydigan AURA RoboClean Pro. Foizsiz 8–24 oyga bo'lib to'lash, bepul demonstratsiya va servis. Rasmiy diler.",
  openGraph: {
    title: "AURA RoboClean Pro — uy tozaligida yangi daraja",
    description: "Suv filtri, 99% gacha chang va allergenlar. Foizsiz muddatli to'lov, bepul demonstratsiya.",
    type: "website",
    locale: "uz_UZ",
  },
};

export const viewport: Viewport = { themeColor: "#07131c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${manrope.variable} ${unbounded.variable}`}>
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
