import UserProfile from "@/app/components/UserProfile/UserProfile";
import React from "react";

export const metadata = {
  title: "My Profile | DelhiBookStore",
  description:
    "View your saved luxury and rare books on your DelhiBookStore Profile for future reference or purchase.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },

  openGraph: {
    title: "My Profile | DelhiBookStore",
    description: "View your saved luxury and rare books.",
  },
  twitter: {
    card: "summary",
    title: "My Profile | DelhiBookStore",
    description: "View your saved luxury and rare books.",
  },
};

const page = () => {
  return <UserProfile />;
};

export default page;
