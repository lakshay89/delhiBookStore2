import Wishlist from "@/components/Wishlist/Wishlist";
import React from "react";

export const metadata = {
  title: "My Wishlist | DelhiBookStore",
  description:
    "View your saved luxury and rare books on your DelhiBookStore top books wishlist for future reference or purchase.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },

  openGraph: {
    title: "My Wishlist | DelhiBookStore",
    description: "View your saved luxury and rare books.",
  },
  twitter: {
    card: "summary",
    title: "My Wishlist | DelhiBookStore",
    description: "View your saved luxury and rare books.",
  },
};

const page = () => {
  return (
    <div>
      <Wishlist />
    </div>
  );
};

export default page;
