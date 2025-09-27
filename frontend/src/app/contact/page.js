import React from "react";

import ContactUs from "../../components/Contact/ContactUS";

export const metadata = {
  title: "Contact DelhiBookStore | Customer Service & Inquiries", // Clear and action-oriented title
  description:
    "Get in touch with DelhiBookStore for customer service, inquiries about luxury and rare books, or any support. We're here to assist discerning readers worldwide, from our base in Delhi, India.",
  keywords: [
    "DelhiBookStore contact",
    "contact Delhi luxury books",
    "rare book store customer service",
    "worldwide luxury book contact",
    "DelhiBookStore customer support",
    "get in touch Delhi books",
    "online bookstore contact details",
    "Delhi premium book inquiry",
    "international rare book support",
    "book collector assistance",
    "DelhiBookStore address", // Include if you have a physical presence
    "DelhiBookStore phone number",
    "book selling inquiry",
    "consignment contact books",
    "media contact luxury books",
    "press contact DelhiBookStore",
    "feedback DelhiBookStore",
    "complain DelhiBookStore",
    "query DelhiBookStore",
    "book valuation contact",
    "corporate orders contact",
    "international shipping queries",
    "order status contact",
    "report website issue DelhiBookStore",
    "Delhi, India bookstore contact",
    "contact details luxury books",
    "premium book customer care",
    "reach out DelhiBookStore",
    "ask DelhiBookStore",
    "book related questions",
  ], // 30+ keywords
  openGraph: {
    title: "Contact DelhiBookStore | Customer Service & Inquiries",
    description:
      "Get in touch with DelhiBookStore for customer service, inquiries about luxury and rare books, or any support. We're here to assist discerning readers worldwide, from our base in Delhi, India.",
    url: "https://www.delhibookstore.com/contact", // **IMPORTANT: Your actual Contact Us page URL**
    siteName: "DelhiBookStore",
    images: [
      {
        url: "https://www.delhibookstore.com/og-image-contact.jpg", // **Custom OG image for Contact Us**
        width: 1200,
        height: 630,
        alt: "Contact DelhiBookStore - Premium Customer Support",
      },
    ],
    locale: "en_US",
    type: "website", // or 'ContactPage' if that specific Schema.org type is implemented
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact DelhiBookStore | Customer Service & Inquiries",
    description:
      "Get in touch with DelhiBookStore for customer service, inquiries about luxury and rare books, or any support. We're here to assist discerning readers worldwide, from our base in Delhi, India.",
    creator: "@delhibookstore_official", // Your Twitter handle
    images: ["https://www.delhibookstore.com/twitter-image-contact.jpg"], // Custom Twitter image
  },
  alternates: {
    canonical: "https://www.delhibookstore.com/contact",
  },
};

const page = () => {
  return <ContactUs />;
};

export default page;
