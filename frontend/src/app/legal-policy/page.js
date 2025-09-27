import React from "react";

export const metadata = {
  title: "Privacy Policy | DelhiBookStore - Data Protection & User Rights", // Clear, trust-building title
  description:
    "Understand DelhiBookStore's Privacy Policy. Learn how we collect, use, and protect your personal data for a secure luxury book shopping experience, in compliance with international standards.",
  keywords: [
    "DelhiBookStore privacy policy",
    "luxury book store data privacy",
    "premium books online privacy statement",
    "DelhiBookStore data protection",
    "privacy policy India ecommerce",
    "bookstore user data policy",
    "international book data privacy",
    "customer data protection policy",
    "online shopping privacy policy",
    "personal information handling",
    "website privacy practices",
    "cookie policy DelhiBookStore",
    "user rights data",
    "GDPR compliance bookstore",
    "CCPA compliance bookstore",
    "data security measures online",
    "personal data usage",
    "online book shop privacy",
    "ecommerce privacy statement",
    "how DelhiBookStore uses data",
    "your data rights bookstore",
    "privacy commitment luxury books",
    "online data collection policy",
    "privacy notice DelhiBookStore",
    "information collection policy",
    "online privacy rules India",
    "data processing transparency",
    "secure data handling books",
    "user consent policy",
    "website tracking policy",
  ], // 30+ keywords
  openGraph: {
    title: "Privacy Policy | DelhiBookStore - Data Protection & User Rights",
    description:
      "Understand DelhiBookStore's Privacy Policy. Learn how we collect, use, and protect your personal data for a secure luxury book shopping experience, in compliance with international standards.",
    url: "https://www.delhibookstore.com/pages/legal-policy", // **IMPORTANT: Your actual Privacy Policy URL**
    siteName: "DelhiBookStore",
    images: [
      {
        url: "https://www.delhibookstore.com/og-image-privacy-policy.jpg", // **Custom OG image (e.g., a lock icon or abstract data) **
        width: 1200,
        height: 630,
        alt: "DelhiBookStore Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | DelhiBookStore - Data Protection & User Rights",
    description:
      "Understand DelhiBookStore's Privacy Policy. Learn how we collect, use, and protect your personal data for a secure luxury book shopping experience, in compliance with international standards.",
    creator: "@delhibookstore_official",
    images: ["https://www.delhibookstore.com/twitter-image-privacy-policy.jpg"],
  },
  alternates: {
    canonical: "https://www.delhibookstore.com/pages/legal-policy",
  },
};
const page = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen px-4 py-8 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Legal Policy</h1>

        <p className="mb-4">
          <strong>Delhibookstore.com</strong> is committed to protecting your
          privacy. All personal information collected is used only to provide
          you a more personalized shopping experience.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Uses of the information we collect from you
        </h2>
        <p className="mb-4">
          We may use the information we collected to occasionally notify you
          about important functionality changes to our website, new
          delhibookstore.com services, and special offers we believe you&apos;ll
          find valuable. If you do not wish to receive this information, email
          us at{" "}
          <a
            href="mailto:admin@delhibookstore.com"
            className="text-blue-600 underline"
          >
            admin@delhibookstore.com
          </a>{" "}
          to change your preferences.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Does delhibookstore.com protect its customer information?
        </h2>
        <p className="mb-4">
          When you place orders or access your account information, we offer the
          use of a secure server. The secure server software encrypts all
          information you input before it is sent to us. In addition, all
          customer data we collect is protected against unauthorized access.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
        <p className="mb-4">
          &quot;Cookies&quot; are small pieces of information that are stored by
          your browser on your computer&apos;s hard drive. The cookies do not
          contain any personally identifying information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Does delhibookstore.com disclose the information it collects to
          outside parties?
        </h2>
        <p className="mb-4">
          Delhibookstore.com does not sell, trade, or rent your personal
          information to others. Delhibookstore.com may provide some statistics
          about our customers, sales, traffic patterns, and related site
          information to reputable third-party vendors, but these statistics
          will include no personally identifying data. Delhibookstore.com may
          release account information when it believes, in good faith, that such
          release is reasonably necessary to (i) comply with law, (ii) enforce
          or apply the terms of any of our user agreements, or (iii) protect the
          rights, property or safety of delhibookstore.com, our users, or
          others.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Edit your Account Information
        </h2>
        <p className="mb-4">
          To change information related to your delhibookstore.com account,
          access the My Account section of our website with your email address
          and password. For any other questions related to your account
          management, please email{" "}
          <a
            href="mailto:sales@delhibookstore.com"
            className="text-blue-600 underline"
          >
            sales@delhibookstore.com
          </a>
          . When you register with delhibookstore.com you agree to the
          delhibookstore.com terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default page;
