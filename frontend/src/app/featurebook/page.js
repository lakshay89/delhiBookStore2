import Featureproduct from "@/components/FeatureProduct/Featureproduct";
import ShopBanner from "@/components/Shop/ShopBanner";
import React from "react";

export const metadata = {
  title: "Featured Books | Handpicked Luxury & Rare Editions - DelhiBookStore", // Emphasize curation and exclusivity
  description:
    "Explore DelhiBookStore's exclusive collection of featured luxury books, rare editions, and handpicked literary masterpieces. Discover unique finds and staff favorites from Delhi to the world.",
  keywords: [
    "featured luxury books",
    "premium curated books",
    "DelhiBookStore staff picks",
    "rare book highlights",
    "exclusive book collection",
    "handpicked luxury reads",
    "top curated editions",
    "unique collectible books",
    "recommended premium books",
    "Delhi's featured books",
    "international curated selection books",
    "special edition books",
    "new arrivals luxury books",
    "fine art featured books",
    "collectors showcase books",
    "boutique bookstore selections",
    "limited availability books",
    "curated literary treasures",
    "delhi luxury book recommendations",
    "premium gift books",
    "investment worthy books",
    "rare finds online bookstore",
    "exclusive first editions",
    "signed books showcase",
    "artisanal books featured",
    "curated photography books",
    "design book highlights",
    "most unique books DelhiBookStore",
    "literary masterpieces featured",
    "expert selected books",
  ], // 30 keywords
  openGraph: {
    title:
      "Featured Books | Handpicked Luxury & Rare Editions - DelhiBookStore",
    description:
      "Explore DelhiBookStore's exclusive collection of featured luxury books, rare editions, and handpicked literary masterpieces. Discover unique finds and staff favorites from Delhi to the world.",
    url: "https://www.delhibookstore.com/pages/featurebook", // **IMPORTANT: Your actual Featured Books page URL**
    siteName: "DelhiBookStore",
    images: [
      {
        url: "https://www.delhibookstore.com/og-image-featured-books.jpg", // **Custom OG image for Featured Books**
        width: 1200,
        height: 630,
        alt: "DelhiBookStore Featured Luxury & Rare Books",
      },
    ],
    locale: "en_US",
    type: "website", // or 'CollectionPage'
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Featured Books | Handpicked Luxury & Rare Editions - DelhiBookStore",
    description:
      "Explore DelhiBookStore's exclusive collection of featured luxury books, rare editions, and handpicked literary masterpieces. Discover unique finds and staff favorites from Delhi to the world.",
    creator: "@delhibookstore_official", // Your Twitter handle
    images: ["https://www.delhibookstore.com/twitter-image-featured-books.jpg"], // Custom Twitter image
  },
  alternates: {
    canonical: "https://www.delhibookstore.com/pages/featurebook",
  },
};
const page = () => {
  return (
    <>
      <ShopBanner />
      <Featureproduct productlength={10000} btnlength={10000} />
    </>
  );
};

export default page;
