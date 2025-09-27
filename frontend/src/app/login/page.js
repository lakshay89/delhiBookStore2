import React from "react";
import Login from "@/components/Login/Login";

export const metadata = {
  title: "Login to Your Account | DelhiBookStore",
  description:
    "Log in to your DelhiBookStore account to manage orders, view history, and update your profile.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },

  openGraph: {
    title: "Login to Your Account | DelhiBookStore",
    description: "Access your DelhiBookStore account.",
    url: "https://www.delhibookstore.com/pages/login", // Include URL for consistency, but robots: noindex is primary
  },
  twitter: {
    card: "summary",
    title: "Login to Your Account | DelhiBookStore",
    description: "Access your DelhiBookStore account.",
  },
};

const Page = () => {
  return<>
  <Login />
   </> ;
};

export default Page;
