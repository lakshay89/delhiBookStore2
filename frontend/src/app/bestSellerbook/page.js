import React from "react";
import Image from "next/image";
import Image1 from "../Images/DBS/BOOKSTOREBANNER.jpg";
import BestSeller from "../../components/BestSeller/BestSeller";

export const metadata = {
  title:
    "Bestsellers | Top Best Selling & Rare Books - DelhiBookStore (Worldwide)",
  description:
    "Explore the current bestselling luxury books, rare editions, and most popular collectible reads at DelhiBookStore. Discover what discerning readers worldwide are acquiring from Delhi's premium selection.",
  keywords: [
    "bestselling luxury books",
    "top selling premium books",
    "DelhiBookStore bestsellers",
    "most popular rare books",
    "best collectible books online",
    "finest book bestsellers",
    "current top luxury reads",
    "high-end book bestsellers",
    "luxury novels bestsellers",
    "rare non-fiction bestsellers",
    "popular first editions",
    "best signed books",
    "trending fine bindings",
    "global book bestsellers",
    "international best selling books",
    "Delhi's top luxury books",
    "highly sought after books",
    "top rated premium reads",
    "must-have collectible books",
    "literary bestsellers DelhiBookStore",
    "exclusive bestseller list",
    "newest luxury bestsellers",
    "iconic books top sales",
    "book collector favorites",
    "premium literary works bestsellers",
    "most acquired rare books",
    "luxury art books bestsellers",
    "photography books top sales",
    "design books popular",
    "fashion books bestsellers",
  ], // Now 30 keywords
  openGraph: {
    title:
      "Bestsellers | Top Best Selling & Rare Books - DelhiBookStore (Worldwide)",
    description:
      "Explore the current bestselling luxury books, rare editions, and most popular collectible reads at DelhiBookStore. Discover what discerning readers worldwide are acquiring from Delhi's premium selection.",
    url: "https://www.delhibookstore.com/bestsellers",
    siteName: "DelhiBookStore",
    images: [
      {
        url: "https://www.delhibookstore.com/og-image-bestsellers.jpg",
        width: 1200,
        height: 630,
        alt: "DelhiBookStore Bestselling Luxury Books",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Bestsellers | Top Best Selling & Rare Books - DelhiBookStore (Worldwide)",
    description:
      "Explore the current bestselling luxury books, rare editions, and most popular collectible reads at DelhiBookStore. Discover what discerning readers worldwide are acquiring from Delhi's premium selection.",
    creator: "@delhibookstore_official",
    images: ["https://www.delhibookstore.com/twitter-image-bestsellers.jpg"],
  },
  alternates: {
    canonical: "https://www.delhibookstore.com/bestsellers",
  },
};
const page = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="relative rounded-xl overflow-hidden group">
        {/* Background Image */}
        <Image
          src={Image1}
          alt="Supermarket banner"
          width={1200}
          height={400}
          className="w-full h-[200px] object-fill md:h-[300px] md:object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h2 className="text-white text-2xl md:text-4xl font-bold">
            Best Selling Books
          </h2>
        </div>
      </div>
      <BestSeller productlength={10000} btnlength={10000} />
    </div>
  );
};

export default page;
