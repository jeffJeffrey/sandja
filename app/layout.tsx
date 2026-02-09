// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Amatic_SC } from "next/font/google";
import "./globals.css";



const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const amatic = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amatic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SANDJA - Le Pagne du Futur",
    template: "%s | SANDJA",
  },
  description:
    "Redonner sens et valeur au pagne africain par la technologie. Plateforme culturelle pour la préservation du patrimoine textile africain.",
  keywords: [
    "pagne africain",
    "textile africain",
    "patrimoine culturel",
    "NFT africain",
    "Cardano",
    "culture camerounaise",
    "Ndop",
    "Bamiléké",
  ],
  authors: [{ name: "SANDJA Team" }],
  creator: "SANDJA",
  publisher: "SANDJA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sandja.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: "/",
    siteName: "SANDJA",
    title: "SANDJA - Le Pagne du Futur",
    description:
      "Redonner sens et valeur au pagne africain par la technologie",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SANDJA - Le Pagne du Futur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SANDJA - Le Pagne du Futur",
    description:
      "Redonner sens et valeur au pagne africain par la technologie",
    images: ["/images/og-image.jpg"],
    creator: "@sandja_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${amatic.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
