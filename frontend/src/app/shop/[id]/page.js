// app/shop/[id]/page.js
import axiosInstance from "@/app/redux/features/axiosInstance";
import Featureproduct from "@/components/FeatureProduct/Featureproduct";
import ProductDetails from "@/components/ProductsDetails/ProductsDetails";
import React from "react";

// ✅ Generate metadata dynamically based on product
export async function generateMetadata({ params }) {
  console.log("Generating metadata for product ID:", params.id);
  const { id } = params;

  // Fetch product details
  // const res = await fetch(`${process.env.API_URL}/products/${id}`, {
  //   next: { revalidate: 60 }, // ISR: cache + refresh every 60s
  // });

  const res = await axiosInstance.get(`product/get-product/${id}`, {
    next: { revalidate: 60 }, // always fresh for details
  });
  console.log("res in metadata:==>", res);
  if (!res.ok) {
    return {
      title: "Book Not Found | DelhiBookStore",
      description: "This book could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const product = await res.json();

  const productTitle = product.title || "Book Details";
  const categoryName = product.subCategory?.category?.name || "Books";
  const subCategoryName = product.subCategory?.name || "";

  const pageTitle = `${productTitle} | ${categoryName} | DelhiBookStore`;
  const pageDescription = `Buy ${productTitle} from DelhiBookStore. Explore our ${categoryName}${
    subCategoryName ? " > " + subCategoryName : ""
  } collection. Rare, collectible, and premium books.`;

  const pageUrl = `https://www.delhibookstore.com/shop/${id}`;
  // const pageUrl = `http://localhost:3000/shop/${id}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      productTitle,
      categoryName,
      subCategoryName,
      "DelhiBookStore",
    ].join(", "),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: "DelhiBookStore",
      locale: "en_US",
      type: "product",
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

// ✅ Page Component
const Page = async ({ params }) => {
  const { id } = params;

  // Fetch product again for rendering
  // const res = await fetch(`${process.env.API_URL}/products/${id}`, {
  //   cache: "no-store", // always fresh for details
  // });

  const res = await axiosInstance.get(`product/get-product/${id}`);

  if (!res.status === 200) {
    return <h1> GGG Product not found</h1>;
  }

  const product = res?.data?.product;

  return (
    <div>
      {/* Pass names for breadcrumbs */}
      <ProductDetails
        productTitle={product?.title}
        categoryName={product?.subCategory?.category?.name}
        subCategoryName={product?.subCategory?.name}
        product={product}
      />

      <Featureproduct productlength={27} />
    </div>
  );
};

export default Page;
