import "./globals.css";
// import Header from "./components/Header/Header";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ReduxProvider from "./redux/ReduxProvider";
import ReduxProvider from "../app/redux/ReduxProvider";
import AppLayout from "./AppLayout";

export const metadata = {
  title: {
    default: "DelhiBookStore | Luxury Premium Books & Collectibles", // Strong default title
    template: "%s | DelhiBookStore", // Template for specific pages
  },
  description:
    "Explore a curated collection of luxury premium books, rare editions, and exquisite literary art from DelhiBookStore. Worldwide shipping available for discerning readers and collectors.",
  keywords: [
    "DelhiBookStore",
    "luxury bookstore",
    "premium books",
    "rare books",
    "collectible books",
    "fine bindings",
    "literary art",
    "international bookstore",
    "online bookstore",
    "Delhi books",
    "worldwide shipping books",
    "exclusive editions",
    "first editions",
    "signed books",
    "art books",
    "photography books",
    "fashion books",
    "design books",
    "high-end books",
    "boutique bookstore",
  ],
  openGraph: {
    title: "DelhiBookStore | Luxury Premium Books & Collectibles",
    description:
      "Explore a curated collection of luxury premium books, rare editions, and exquisite literary art from DelhiBookStore. Worldwide shipping available for discerning readers and collectors.",
    url: "https://www.delhibookstore.com/", // **IMPORTANT: Replace with your actual domain**
    siteName: "DelhiBookStore",
    images: [
      {
        url: "https://www.delhibookstore.com/og-image-delhibookstore.jpg", // **Create a custom OG image for your brand**
        width: 1200,
        height: 630,
        alt: "DelhiBookStore - Luxury Books & Collectibles",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DelhiBookStore | Luxury Premium Books & Collectibles",
    description:
      "Explore a curated collection of luxury premium books, rare editions, and exquisite literary art from DelhiBookStore. Worldwide shipping available for discerning readers and collectors.",
    creator: "@delhibookstore_official", // **Replace with your actual Twitter handle if you have one**
    images: ["https://www.delhibookstore.com/twitter-image-delhibookstore.jpg"], // **Create a custom Twitter image for your brand**
  },
  alternates: {
    canonical: "https://www.delhibookstore.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
