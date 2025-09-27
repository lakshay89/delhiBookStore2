
import SubCategory from "../../components/SubCategory/AllSubCategory";
import React from "react";

export const metadata = {
    title: "All Book Categories | Premium & Rare Editions - DelhiBookStore",
    description:
        "Browse all categories of luxury, premium, and rare books at DelhiBookStore. Explore curated collections by genre, format, and exclusivity for discerning readers worldwide.",
    keywords: [
        "luxury book categories",
        "premium books by genre",
        "all books DelhiBookStore",
        "rare book types",
        "collectible editions categories",
        "fine binding categories",
        "online bookstore categories",
        "explore literary genres",
        "art books collection categories",
        "design books categories",
        "photography books categories",
        "fashion books categories",
        "historical books categories",
        "signed editions categories",
        "first editions categories",
        "vintage books categories",
        "modern literary categories",
        "philosophy books categories",
        "biography categories",
        "fiction categories",
        "non-fiction categories",
        "DelhiBookStore collections",
        "international book types",
        "curated book categories",
        "exclusive book genres",
        "limited edition book categories",
        "architecture books categories",
        "travel books categories",
        "cooking books categories",
        "childrens luxury books categories",
        "literature categories online",
        "specialty books online",
        "book format categories",
        "collecting categories",
        "book subjects",
        "browse bookstore by type",
    ], // 36 keywords
    openGraph: {
        title: "All Book Categories | Luxury & Rare Editions - DelhiBookStore",
        description:
            "Browse all categories of luxury, premium, and rare books at DelhiBookStore. Explore curated collections by genre, format, and exclusivity for discerning readers worldwide.",
        url: "https://www.delhibookstore.com/subCategories", // **IMPORTANT: Your actual Categories page URL**
        siteName: "DelhiBookStore",
        images: [
            {
                url: "https://www.delhibookstore.com/og-image-categories.jpg", // **Custom OG image for Categories**
                width: 1200,
                height: 630,
                alt: "DelhiBookStore Book Categories and Collections",
            },
        ],
        locale: "en_US",
        type: "website", // Use 'website' or 'CollectionPage'
    },
    twitter: {
        card: "summary_large_image",
        title: "All Book Categories | Luxury & Rare Editions - DelhiBookStore",
        description:
            "Browse all categories of luxury, premium, and rare books at DelhiBookStore. Explore curated collections by genre, format, and exclusivity for discerning readers worldwide.",
        creator: "@delhibookstore_official", // Your Twitter handle
        images: ["https://www.delhibookstore.com/twitter-image-categories.jpg"], // Custom Twitter image for Categories
    },
    alternates: {
        canonical: "https://www.delhibookstore.com/subCategories",
    },
};

const page = ({searchParams}) => {
    return <SubCategory  searchParams={searchParams}/>;
};

export default page;
