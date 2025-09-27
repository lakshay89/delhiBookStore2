import Cart from "@/components/Cart/Cart";
import React from "react";

export const metadata = {
  title: "Your Cart | DelhiBookStore",
  description:
    "Review your selected luxury books and proceed to checkout at DelhiBookStore.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },

  openGraph: {
    title: "Your Cart | DelhiBookStore",
    description: "Review your selected luxury books.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Your Cart | DelhiBookStore",
    description: "Review your selected luxury books.",
    url: "https://www.delhibookstore.com/cart", // Include URL for consistency, but robots: noindex is primary
  },
};
const page = () => {
  return (
    <div>
      <Cart />
    </div>
  );
};

export default page;
