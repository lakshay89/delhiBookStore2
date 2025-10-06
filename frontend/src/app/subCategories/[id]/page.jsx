// app/categories/[mainCategorySlug]/[subCategorySlug]/page.js
import SubCategory from "@/components/SubCategory/AllSubCategory";
import React from "react";

// ✅ Dynamic metadata using params (safe checks)
export async function generateMetadata({ params }) {
  const { mainCategorySlug, subCategorySlug } = params || {};

  const mainCategoryName = mainCategorySlug
    ? mainCategorySlug.replace(/-/g, " ")
    : "Category";

  const subCategoryName = subCategorySlug
    ? subCategorySlug.replace(/-/g, " ")
    : "Subcategory";

  const pageTitle = `${subCategoryName} | ${mainCategoryName} | DelhiBookStore`;
  const pageDescription = `Explore ${subCategoryName} books from DelhiBookStore's ${mainCategoryName} collection. Rare editions, curated selections, and more.`;

  const pageKeywords = [
    "DelhiBookStore",
    mainCategoryName,
    subCategoryName,
    "books",
    "buy books online",
    "bookstore",
  ];

  const pageUrl = `https://www.delhibookstore.com/categories/${mainCategorySlug || ""}/${subCategorySlug || ""}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords.join(", "),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: "DelhiBookStore",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      creator: "@delhibookstore_official",
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ✅ Page component
const Page = ({ params, searchParams }) => {
  const { id } = params || {};
  const nameParam = (searchParams && searchParams.name) || "";
  const parentName = (searchParams && searchParams.parentName) || "";
  const parentId = (searchParams && searchParams.parentId) || undefined;

  const subCategoryName = nameParam ? String(nameParam).replace(/-/g, " ") : "Subcategory";

  // Pass parent info to SubCategory
  return (
    <SubCategory
      categoryName={parentName ? decodeURIComponent(parentName) : undefined}
      categorySlug={parentId}
      subCategoryName={subCategoryName}
      subCategorySlug={id} // pass the id so the component can fetch products/subcategories
    />
  );
};

export default Page;
