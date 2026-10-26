import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"], weight: ["500", "600"] });
const source = Source_Sans_3({ variable: "--font-source", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "A1 Truck & Auto Sales | Used Commercial Trucks in Modesto, CA", template: "%s | A1 Truck & Auto Sales" },
  description: "Used dump, box, service, flatbed and tow trucks for sale in Modesto, California. Call (209) 857-0195.",
  metadataBase: new URL(`${site.url}/`),
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${source.variable}`}>
      <body className="font-sans text-[17px] antialiased">
        {children}
      </body>
    </html>
  );
}
